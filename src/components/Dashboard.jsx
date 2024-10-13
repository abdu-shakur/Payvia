import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [funds, setFunds] = useState(null); 

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const token = localStorage.getItem('token'); 
        console.log(token);

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
      } catch (error) {
        console.error('Error fetching funds:', error);
      }
    };

    fetchFunds();
  }, []);
  let transactions = [
    {
      _id: 1,
      date: '13/10/2024',
      amount: 100,
      status: 'Sucess',
      method: 'withdraw'
    },
    {
      _id: 2,
      date: '13/10/2024',
      amount: 200,
      status: 'Sucess',
      method: 'Transfer'
    },
    {
      _id: 3,
      date: '13/10/2024',
      amount: 100,
      status: 'Sucess',
      method: 'Deposit'
    }
  ]

  if (!funds) {
    return <p>Loading...</p>; 
  }

  return (
    <div className='ml-3'>
      {/* <h1 className='text-primary'>Dashboard: {funds.value}</h1> */}
      <h3 className='text-primary font-bold text-2xl'> Your Payvia Dashboard</h3>
      <p>
        <strong className='text-Accent'>Balance: </strong>
        <span className='font-bold'><span>{funds.value}</span> <span className='text-sm'>{funds.currency} </span></span>
      </p>
    <hr />
      <h3>Transaction History</h3>
      <table border="1">
        <thead className='m-2 flex justify-between'>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
      
          {transactions?.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.date}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.status}</td>
              <td>{transaction.method}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button>Make Payment</button>
    </div>
  );
}

export default Dashboard;
