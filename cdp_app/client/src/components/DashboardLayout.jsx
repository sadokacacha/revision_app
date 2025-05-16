import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
