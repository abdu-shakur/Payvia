import axios from 'axios';
import React, { useState } from 'react'; 

const apiUrl = import.meta.env.VITE_API_URL;

function LocalPaymentForm() {
    const [username, setUsername] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

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
      const response = await axios.post(
        `${apiUrl}/api/dashboard/transaction/initiateLocal`,
        {amount,username},
        config
      );
      
      console.log(response)
      window.location.href=('/dashboard');
    } catch (error) {
      console.error('Error initiating transaction:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };
  
 
  return (
    <div>
      <h2 className="text-primary font-medium">Payvia Transfer Form</h2>
      <form onSubmit={initiateTransaction}>
        <label>Username</label>
        <input
          required
          placeholder="Enter Recipent Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Amount</label>
        <input
          required
          type="number" 
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit" className="submit-button">
          Transfer
        </button>
      </form>
      {error && <p className="text-warning">{error}</p>}
    </div>
  );
}

export default LocalPaymentForm;
