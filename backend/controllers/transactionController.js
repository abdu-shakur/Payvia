const asyncHandler = require('express-async-handler');
const axios = require('axios');
const crypto = require('crypto')

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

  //Local Transfer reference keygen
  const generateReferenceCode = (userId) => {
    const uniquePart = crypto.randomBytes(3).toString('hex'); // Random hex code
    const timestampPart = Date.now().toString(36); // Encoded timestamp
    return `${userId}-${uniquePart}-${timestampPart}`;
};
  
  const { username, amount } = req.body; 
  const transactionAmount = Number(amount);
  // Find the sender
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'Sender user not found' });
  }

  // Ensure user is not transferring funds to themselves
  if (user.username === username) {
    return res.status(400).json({ message: 'Cannot transfer to your own account' });
  }

  // Find the recipient
  const recipient = await User.findOne({ username });
  if (!recipient) {
    return res.status(404).json({ message: 'Recipient user not found' });
  }

  // Find sender and recipient wallets
  const senderWallet = await Wallet.findOne({ userId });
  const recipientWallet = await Wallet.findOne({ userId: recipient._id });

  if (!senderWallet || !recipientWallet) {
    return res.status(404).json({ message: 'Wallet not found for one of the users' });
  }

  // Check if the sender has sufficient balance
  if (senderWallet.balance.value < transactionAmount) {
    return res.status(400).json({ message: 'Insufficient funds in your wallet' });
  }

  // Perform the transfer (subtract from sender, add to recipient)
  const transactionStatus = 'success';
  senderWallet.balance.value -= transactionAmount;
  recipientWallet.balance.value += transactionAmount;



  // Save the updated balances
  await senderWallet.save();
  await recipientWallet.save();

  const referenceCode = generateReferenceCode(userId)

  const transaction = new Transaction({
    userId,
    recipientId: recipient.id,
    referenceCode,
    amount: {
      currency: 'Naira',
      value: transactionAmount
    },
    transactionType: 'transfer',
    status: transactionStatus
  })

  await transaction.save()

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
        transactionStatus = "failed";
        return res.status(404).json({ message: 'User not found' });
      }

      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        transactionStatus = "failed";
        return res.status(404).json({ message: 'Wallet not found' });
      }

      // Add the amount to the user's wallet balance
      wallet.balance.value += amountPaid;
      await wallet.save();

      // Update or create transaction
      const transaction = await Transaction.findOneAndUpdate(
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
          status: transactionStatus
        },
        { upsert: true, new: true } // Create if doesn't exist
      );

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

  res.status(200).json("transaction: ", Transaction);
});


const transactionHistory = asyncHandler(async (req,res) => {
  try {
    const userId = req.user.id
    //const userTransactions =await Transaction.find({userId}).sort({ lastUpdate: -1 })
    const userTransactions = await Transaction.find({
      $or: [{ senderId: userId }, { recipientId: userId }],
    }).sort({ createdAt: -1 });
    return res.status(200).json(userTransactions)
  } catch (error) {
    return res.status(400).json("error: ",error)
  }
})

module.exports = { 
  InitiatePaystackTransaction, 
  initiateLocalTransaction, 
  verifyTransaction, 
  getTransaction,
  transactionHistory 
};
