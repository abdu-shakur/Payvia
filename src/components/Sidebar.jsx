import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-primary text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:bg-blue-700 p-2 rounded-lg">
          Dashboard
        </Link>
        <Link to="/dashboard/transactions" className="hover:bg-blue-700 p-2 rounded-lg">
          Transaction History
        </Link>
        <Link to="/dashboard/settings" className="hover:bg-blue-700 p-2 rounded-lg">
          Settings
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
