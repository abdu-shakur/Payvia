// DashboardLayout.js
import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar />
      </div> {/* Sidebar appears only in Dashboard routes */}
      <main className="flex-1 p-6">
        <Outlet /> {/* Render the nested dashboard routes here */}
      </main>
    </div>
  );
}

export default DashboardLayout;
