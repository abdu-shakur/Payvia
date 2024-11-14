import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'

function Dashboard() {
  const [funds, setFunds] = useState(null);
  const [username, setUsername]=useState('User');
  const [transactions, setTransactions]=useState()
  const [showAddMoneyOptions, setShowAddMoneyOptions] = useState(false);
  const [showWithdrawMoneyOptions, setShowWithdrawMoneyOptions] = useState(false);

  const addMoneyClick = () => {
    setShowAddMoneyOptions(!showAddMoneyOptions);
    setShowWithdrawMoneyOptions(false)
  };
  const withdrawMoneyClick = () => {
    setShowWithdrawMoneyOptions(!showWithdrawMoneyOptions);
    setShowAddMoneyOptions(false)
  };

const closeAddMoneyDialogue = () => {
  setShowAddMoneyOptions(false)
}
const closeWithdrawMoneyDialogue = () => {
  setShowWithdrawMoneyOptions(false)
}
  
  
  
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.name);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          'http://localhost:8000/api/dashboard/balance',
          config
        );
        setFunds(data);

        const Usertransactions = await axios.get(
          'http://localhost:8000/api/dashboard/transactions',
          config
        );
          setTransactions(Usertransactions.data)
          console.log(Usertransactions.data)
      } catch (error) {
        console.error('Error fetching funds:', error);
        console.error('Error decoding token:', error);
      }
    };

    fetchFunds();
  }, []);

  

  // const usernamei = "Abdushakur";
  if (!funds || !transactions) {
    return <p className="text-text">Loading...</p>;
  }
  
  

  return (
    <div className="p-6 bg-secondary min-h-screen">
      <h3 className="font-bold text-3xl mb-2">
        Welcome, <span className="text-primary">{username || 'User'}</span>
      </h3>
      <p className="text-text mb-8">Access and manage your funds efficiently.</p>

      <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
        <h3 className="text-text text-lg">Total Current Balance</h3>
        <h2 className="text-primary font-bold text-4xl">
          {funds.currency === "Naira" ? "₦" : ""}{funds.value}
        </h2>
      </div>
    <div className="flex space-x-4 mb-8">
        <button className="bg-primary text-white font-light py-2 px-4 rounded-lg hover:bg-blue-600" onClick={addMoneyClick}>
          Add Money
        </button>
        {showAddMoneyOptions && (
          <div className="absolute bg-white shadow-lg rounded-md p-4 mt-2 w-64">
            <div className="flex justify-between">
              <h4 className="font-semibold text-lg mb-3">Add Money Options</h4>
              <a className="cursor-pointer font-bold text-warning" onClick={closeAddMoneyDialogue}>X</a>
            </div>
            <button className='bg-primary text-white py-2 px-4 rounded-md mb-2 w-full hover:bg-blue-600'><a href="dashboard/initiateTransaction">Add with Paystack</a></button>
            <button className='bg-primary text-white py-2 px-4 rounded-md mb-2 w-full hover:bg-blue-600'>Request Money from Payvia User</button>
          </div>
        )}

        <button className="bg-primary text-white font-light py-2 px-4 rounded-lg hover:bg-blue-600" onClick={withdrawMoneyClick}>
          Trasfer Money
        </button>
        {showWithdrawMoneyOptions && (
          <div className="absolute bg-white shadow-lg rounded-md p-4 mt-2 w-64">
            <div className="flex justify-between">
              <h4 className="font-semibold text-lg mb-3">Transfer Options</h4>
              <a className="cursor-pointer font-bold text-warning" onClick={closeWithdrawMoneyDialogue}>X</a>
            </div>
            <button className='bg-primary text-white py-2 px-4 rounded-md mb-2 w-full hover:bg-blue-600'><a href="dashboard/initiateTransaction">Transfer to Bank</a></button>
            <button className='bg-primary text-white py-2 px-4 rounded-md mb-2 w-full hover:bg-blue-600'><a href="dashboard/payviaTransfer">Transfer to Payvia</a></button>
          </div>
        )}
      </div>
      

      <hr className="border-t border-gray-300 mb-6" />
      <h2 className="text-primary font-semibold text-2xl mb-4">Recent Transactions</h2>

      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-primary text-white text-left">
          <tr>
            <th className="p-4">Date</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
            <th className="p-4">Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.referenceCode} className="bg-secondary hover:bg-gray-100 text-text">
              <td className="p-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
              
              <td className="p-4">{funds.currency === "Naira" ? "₦" : ""}{transaction.amount.value}</td>
              <td className={`p-4 font-semibold ${getStatusClass(transaction.status)}`}>
                {transaction.status}
              </td>
              <td className="p-4">{transaction.transactionType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="mt-6 bg-Accent md:hidden text-white py-2 px-4 rounded-lg hover:bg-green-600">
        View Transaction History
      </button>
    </div>
  );
}

const getStatusClass = (status) => {
  switch (status) {
    case 'success':
      return 'text-sucess';
    case 'Processing':
      return 'text-warning';
    case 'Failed':
      return 'text-error';
    default:
      return 'text-text';
  }
};

export default Dashboard;
