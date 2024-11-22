const asyncHandler = require('express-async-handler');
const axios = require('axios');
const crypto = require('crypto')
const postmark = require('postmark')

const User = require('../models/userModel');
const Wallet = require('../models/fundsModel');
const Transaction = require('../models/transactionModel')

// Initiates a transaction with Paystack
const InitiatePaystackTransaction = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log('User ID:', userId);

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const params = {
    email: user.email,
    amount: req.body.amount * 100, // Convert to kobo for Paystack
  };
  if (params.amount < 0){
    return res.status(400).json({message: "Enter amount greater than 1"})
  }
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      params,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`, 
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status) {
      return res.status(200).json(response.data); 
    } else {
      return res.status(400).json({ message: 'Transaction initialization failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while initiating Paystack transaction' });
  }
});

// Initiates a local transaction (transfer between users)
const initiateLocalTransaction = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username, amount } = req.body; 
  const transactionAmount = Number(amount);
  
  // Find the sender and recipient
  const user = await User.findById(userId);
  const recipient = await User.findOne({ username });

  if (!user || !recipient) {
    return res.status(404).json({ message: 'User not found' });
  }
 
const generateReferenceCode = (userId) => {
    const uniquePart = crypto.randomBytes(3).toString('hex'); // Random hex code
    const timestampPart = Date.now().toString(36); // Encoded timestamp
    return `${userId}-${uniquePart}-${timestampPart}`;
};


  // Ensure recipient and sender have wallets
  const senderWallet = await Wallet.findOne({ userId });
  const recipientWallet = await Wallet.findOne({ userId: recipient._id });
  if (!senderWallet || !recipientWallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }

  if (user.username === username){
    return res.status(400).json({ message: 'Cant transfer to self' });
  }
  console.log("recipient wallet ID:", user.username)
  console.log("sender wallet ID:", username)
 

  // Check balance and perform transfer
  if (senderWallet.balance.value < transactionAmount) {
    return res.status(400).json({ message: 'Insufficient funds' });
  }
  if (transactionAmount < 0) {
    return res.status(400).json({ message: 'Cannot Transfer Negative value' });
  }

  

  // Debit sender and credit recipient
  senderWallet.balance.value -= transactionAmount;
  recipientWallet.balance.value += transactionAmount;

  await senderWallet.save();
  await recipientWallet.save();


  const referenceCode = generateReferenceCode(userId);
  console.log('transaction ID is: ', referenceCode)


  // Record transactions for both users
  const senderTransaction = new Transaction({
    userId,
    recipientId: recipient.id,
    referenceCode,
    amount: { currency: 'Naira', value: transactionAmount },
    transactionType: 'transfer',
    transactionDirection: 'debit',
    status: 'success'
  });

    const recipientTransaction = new Transaction({
    userId: recipient.id,
    recipientId: userId,
    referenceCode,
    amount: { currency: 'Naira', value: transactionAmount },
    transactionType: 'transfer',
    transactionDirection: 'credit',
    status: 'success'
  });

  await senderTransaction.save();
  await recipientTransaction.save();



  
  //Postmark sending to user
  
  const sendReceipt = {
    From: process.env.DEMO_EMAIL,
    To: 'velmolimlo@gufum.com',
    Subject: 'Transaction Reciept',
    HtmlBody: `<h1>YOur Transaction Reciept</h1>
    <p></p>
    <p></p>
    <p>Transaction Amount: N ${transactionAmount}</p>
    <p>Fee: N 0</p>
    
    <small>Thank you for using Payvia</small>`,
    TextBody: `Your Reciept
    Transaction Amount: N ${transactionAmount}
    Fee: N 0
    
    Thank you for using payvia`
  }
  try {
    const response = await axios.post(
      "https://api.postmarkapp.com/email",
      sendReceipt,
      {
        headers: {
          "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending email:", error.response.data);
  }
  


  res.status(200).json({
    message: 'Transfer successful',
    senderBalance: senderWallet.balance.value,
    recipientBalance: recipientWallet.balance.value,
  });
});


// Verifies a transaction (example implementation - can be extended to integrate Paystack verification)
const verifyTransaction = asyncHandler(async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ message: 'Transaction reference is required' });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
        },
      }
    );

    let transactionStatus = "processing";
    const referenceCode = reference;

    if (response.data.data.status === 'success') {
      const amountPaid = response.data.data.amount / 100; 
      const userId = req.user.id;
      transactionStatus = "success";

      // Find user and wallet
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      // Add the amount to the user's wallet balance
      wallet.balance.value += amountPaid;
      await wallet.save();

      // Update or create transaction
  
      const paystackTransaction = await Transaction.findOneAndUpdate(
        { referenceCode },
        {
          userId,
          referenceCode,
          amount: {
            currency: 'Naira',
            value: amountPaid
          },
          transactionType: 'deposit',
          transferType: 'paystack',
          transactionDirection: 'credit',
          status: transactionStatus
        },
        { upsert: true, new: true } // Create if doesn't exist
      );

      await paystackTransaction.save()

      const sendReceipt = {
        From: process.env.DEMO_EMAIL,
        To: 'velmolimlo@gufum.com',
        Subject: 'Transaction Reciept',
        HtmlBody: `<h1>YOur Transaction Reciept</h1>
        <p></p>
        <p></p>
        <p>Transaction Amount: N ${amountPaid}</p>
        <p>Fee: N 0</p>
        
        <small>Thank you for using Payvia</small>`,
        TextBody: `Your Reciept
        Transaction Amount: N N ${amountPaid}
        Fee: N 0
        
        Thank you for using payvia`
      }
      try {
        const response = await axios.post(
          "https://api.postmarkapp.com/email",
          sendReceipt,
          {
            headers: {
              "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Email sent successfully:", response.data);
      } catch (error) {
        console.error("Error sending email:", error.response.data);
      }

      return res.status(200).json({
        message: 'Transaction verified successfully',
        data: response.data.data
      });
    } else {
      transactionStatus = "failed";
      await Transaction.findOneAndUpdate(
        { referenceCode },
        { status: transactionStatus },
        { upsert: true, new: true }
      );

      return res.status(400).json({ message: 'Transaction verification failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error verifying the transaction' });
  }
});


const getTransaction = asyncHandler(async (req, res) => {
  const transactionId = req.params.id; 
  
  const transaction = await Transaction.findById(transactionId); 
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  res.status(200).json({message: "transaction successful", transactiondetails: transaction});
});


const transactionHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const skip = (page - 1) * limit;

  try {
    const userId = req.user.id;
    const filter = req.query.filter || "sent"; 

    let query = { $or: [{ userId }, { recipientId: userId }] };

    
    if (filter === "sent") query = { userId }; 
    if (filter === "received") query = { recipientId: userId };

    const userTransactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await Transaction.countDocuments(query);

    return res.status(200).json({
      transactions: userTransactions,
      totalTransactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
    });
  } catch (error) {
    return res.status(400).json({ message: "Error fetching transactions", error });
  }
});





module.exports = { 
  InitiatePaystackTransaction, 
  initiateLocalTransaction, 
  verifyTransaction, 
  getTransaction,
  transactionHistory 
};
