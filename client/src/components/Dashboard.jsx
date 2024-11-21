import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import Loading from '../pages/Loading';

const apiUrl = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [funds, setFunds] = useState(null);
  const [username, setUsername] = useState('User');
  const [userId, setUserId] = useState();
  const [transactions, setTransactions] = useState([]);
  const [showAddMoneyOptions, setShowAddMoneyOptions] = useState(false);
  const [showWithdrawMoneyOptions, setShowWithdrawMoneyOptions] = useState(false);

  const addMoneyClick = () => {
    setShowAddMoneyOptions(!showAddMoneyOptions);
    setShowWithdrawMoneyOptions(false);
  };

  const withdrawMoneyClick = () => {
    setShowWithdrawMoneyOptions(!showWithdrawMoneyOptions);
    setShowAddMoneyOptions(false);
  };

  const closeAddMoneyDialogue = () => setShowAddMoneyOptions(false);
  const closeWithdrawMoneyDialogue = () => setShowWithdrawMoneyOptions(false);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.name);
        setUserId(decodedToken.id);
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const { data } = await axios.get(`${apiUrl}/api/dashboard/balance`, config);
        setFunds(data);

        const Usertransactions = await axios.get(`${apiUrl}/api/dashboard/transactions`, config);
        setTransactions(Usertransactions.data);
      } catch (error) {
        console.error('Error fetching funds:', error);
      }
    };

    fetchFunds();
  }, []);

  const RecentTransactions = ({ transactionHistory }) => {
    return (
      <div className="overflow-x-auto">
        {transactionHistory.length > 0 ? (
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-primary text-white text-left">
              <tr>
                <th className="p-2 md:p-4">Date</th>
                <th className="p-2 md:p-4">Amount</th>
                <th className="p-2 md:p-4">Status</th>
                <th className="p-2 md:p-4">Payment Method</th>
                <th className="p-2 md:p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory
                .filter((transaction) => transaction.userId === userId).slice(0,10)
                .map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="bg-secondary hover:bg-gray-100 text-text"
                  >
                    <td className="p-2 md:p-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    <td
                      className={`p-2 md:p-4 ${getTransactionDirection(
                        transaction.transactionDirection
                      )}`}
                    >
                      {transaction.transactionDirection === 'debit' ? '- ' : ''}
                      {funds.currency === 'Naira' ? '₦' : ''}
                      {transaction.amount.value}
                    </td>
                    <td
                      className={`p-2 md:p-4 font-semibold ${getStatusClass(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </td>
                    <td className="p-2 md:p-4">{transaction.transactionType}</td>
                    <td className="p-2 md:p-4">
                      <Link to={`receipt/${transaction._id}`} className="text-primary underline">
                        View Receipt
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div>
            <p className="text-center">No recent transactions</p>
          </div>
        )}
      </div>
    );
  };

  if (!funds || !transactions) {
    return <Loading />;
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
          {funds.currency === 'Naira' ? '₦' : ''}
          {funds.value}
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          className="bg-primary text-white font-light py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={addMoneyClick}
        >
          Add Money
        </button>
        {showAddMoneyOptions && (
          <div className="absolute bg-white shadow-lg rounded-md p-4 mt-2 w-64">
            <div className="flex justify-between">
              <h4 className="font-semibold text-lg mb-3">Add Money Options</h4>
              <button
                className="cursor-pointer font-bold text-warning"
                onClick={closeAddMoneyDialogue}
              >
                X
              </button>
            </div>
            <button className="bg-primary text-white py-2 px-4 rounded-md mb-2 w-full hover:bg-blue-600">
              <a href="dashboard/initiateTransaction">Add with Paystack</a>
            </button>
            <button className="bg-primary text-white py-2 px-4 rounded-md mb-2 w-full hover:bg-blue-600">
              Request Money from Payvia User
            </button>
          </div>
        )}

        <button
          className="bg-primary text-white font-light py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={withdrawMoneyClick}
        >
          Transfer Money
        </button>
        {showWithdrawMoneyOptions && (
          <div className="absolute bg-white shadow-lg rounded-md p-4 mt-2 w-64">
            <div className="flex justify-between">
              <h4 className="font-semibold text-lg mb-3">Transfer Options</h4>
              <button
                className="cursor-pointer font-bold text-warning"
                onClick={closeWithdrawMoneyDialogue}
              >
                X
              </button>
            </div>
            <button className="bg-primary text-white py-2 px-4 rounded-md mb-2 w-full hover:bg-blue-600">
              <a href="dashboard/initiateTransaction">Transfer to Bank</a>
            </button>
            <button className="bg-primary text-white py-2 px-4 rounded-md mb-2 w-full hover:bg-blue-600">
              <a href="dashboard/payviaTransfer">Transfer to Payvia</a>
            </button>
          </div>
        )}
      </div>

      <hr className="border-t border-gray-300 mb-6" />
      <h2 className="text-primary font-semibold text-2xl mb-4">
        Recent Transactions
      </h2>

      {<RecentTransactions transactionHistory={transactions} />}
    </div>
  );
}

const getStatusClass = (status) => {
  switch (status) {
    case 'success':
      return 'text-green-600';
    case 'processing':
      return 'text-yellow-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getTransactionDirection = (transactionDirection) => {
  return transactionDirection === 'credit' ? 'text-green-600' : 'text-red-600';
};

export default Dashboard;
