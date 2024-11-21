import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from './Loading';

const apiUrl = import.meta.env.VITE_API_URL;

function Receipt() {
  const [transDetails, setTransDetails] = useState();
  const { id } = useParams();

  useEffect(() => {
    const fetchTransDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/dashboard/transaction/${id}`);
        setTransDetails(response.data.transactiondetails);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchTransDetails();
    } else {
      console.error("No transaction ID provided");
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!transDetails) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="receipt-container max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
       

        <h2 className="text-primary font-bold text-2xl text-center mb-6"><span className='heading hidden'>Payvia </span>Transaction Receipt</h2>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Transaction ID:</p>
          <p className="text-gray-900">{transDetails._id}</p>
        </div>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Reference Code:</p>
          <p className="text-gray-900">{transDetails.referenceCode}</p>
        </div>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Status:</p>
          <p className={`font-bold ${getStatusClass(transDetails.status)}`}>
            {transDetails.status}
          </p>
        </div>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Transaction Type:</p>
          <p className="text-gray-900">{transDetails.transactionType}</p>
        </div>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Amount:</p>
          <p className="text-gray-900">
            {transDetails.amount.currency} {transDetails.amount.value}
          </p>
        </div>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Fees:</p>
          <p className="text-gray-900">
            {transDetails.fees.currency} {transDetails.fees.value}
          </p>
        </div>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Transaction Direction:</p>
          <p className="text-gray-900">{transDetails.transactionDirection}</p>
        </div>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Transfer Type:</p>
          <p className="text-gray-900">{transDetails.transferType}</p>
        </div>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Created At:</p>
          <p className="text-gray-900">{new Date(transDetails.createdAt).toLocaleString()}</p>
        </div>
        <div className="mb-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700 font-semibold">Last Updated:</p>
          <p className="text-gray-900">{new Date(transDetails.lastUpdate).toLocaleString()}</p>
        </div>
        <button
          className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={handlePrint}
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}

const getStatusClass = (status) => {
  switch (status) {
    case 'success':
      return 'text-green-500';
    case 'processing':
      return 'text-yellow-500';
    case 'failed':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export default Receipt;
