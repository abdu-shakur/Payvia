import React from 'react';
import { Link } from 'react-router-dom';



function Sidebar() {
  const Logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
}
  return (
    <div className="w-64 bg-primary text-white h-screen fixed p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="/dashboard" className="hover:bg-blue-700 p-2 rounded-lg">
            Dashboard
          </Link>
          <Link to="/dashboard/transactionHistory" className="hover:bg-blue-700 p-2 rounded-lg">
            Transaction History
          </Link>
          <Link to="/dashboard/settings" className="hover:bg-blue-700 p-2 rounded-lg">
            Settings
          </Link>
        </nav>
      </div>
      <div>
      <button onClick={Logout} className="hover:text-red-500">
        Log Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
