import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../utils/Config";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTransactions = async (page) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/dashboard/transactions?page=${page}&limit=10`,
        config
      );
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Recent Transactions</h2>

      {/* Table Container */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border-spacing-0">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-4 text-left border-b">Date</th>
              <th className="p-4 text-left border-b">Amount</th>
              <th className="p-4 text-left border-b">Status</th>
              <th className="p-4 text-left border-b">Payment Method</th>
              <th className="p-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr
                key={txn._id}
                className="hover:bg-gray-50 text-gray-800 text-sm"
              >
                <td className="p-4 border-b">
                  {new Date(txn.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 border-b">
                  {txn.amount.value < 0 ? "-" : ""}
                  ₦{Math.abs(txn.amount.value)}
                </td>
                <td
                  className={`p-4 border-b capitalize ${
                    txn.status === "success"
                      ? "text-green-600"
                      : txn.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {txn.status}
                </td>
                <td className="p-4 border-b capitalize">{txn.transactionType || "N/A"}</td>
                <td className="p-4 border-b">
                  <Link to={`/dashboard/receipt/${txn._id}`} className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark">
                    View Receipt
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsPage;
