import axios from 'axios';
import React, { useState } from 'react';
import PaystackPop from '@paystack/inline-js';

function PaystackPaymentForm() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionReference, setTransactionReference] = useState('');

  const initiateTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      // Initiate the transaction
      const response = await axios.post(
        'http://localhost:8000/api/dashboard/transaction/initiatePaystack',
        { amount },
        config
      );

      console.log(response)
      if (response.data && response.data.data.access_code && response.data.data.reference) {
        const accessCode = response.data.data.access_code;
        const reference = response.data.data.reference;
        setTransactionReference(reference); 

        const popup = new PaystackPop();
        popup.resumeTransaction(accessCode);

        setTimeout(() => verificationRetry(reference), 5000);
      } else {
        setError('Failed to initialize transaction');
      }
    } catch (error) {
      console.error('Error initiating transaction:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  // Poll verification status
  const verificationRetry = async (reference) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      setLoading(true);
      // Poll every 5 seconds until verified
      const pollInterval = setInterval(async () => {
        const verifyResponse = await axios.post(
          'http://localhost:8000/api/dashboard/transaction/verify',
          { reference },
          config
        );

        console.log("verify response: ", verifyResponse);

        if (verifyResponse.data.data.status === 'success') {
          clearInterval(pollInterval);  // Stop polling
          setLoading(false);
          alert('Payment successful and verified!');
          window.location.href=('/dashboard');
        } else if (verifyResponse.data.status === 'failed') {
          clearInterval(pollInterval);  // Stop polling on failure
          setLoading(false);
          setError('Payment verification failed.');
        }
      }, 5000);
    } catch (error) {
      console.error('Error verifying transaction:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred during verification');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-primary font-medium">Paystack Payment Form</h2>
      <form onSubmit={initiateTransaction}>
        <label>Amount</label>
        <input
          required
          type="number"
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Verifying..." : "Continue on Paystack"}
        </button>
      </form>
      {error && <p className="text-warning">{error}</p>}
    </div>
  );
}

export default PaystackPaymentForm;
