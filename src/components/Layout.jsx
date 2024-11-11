// src/components/Layout.jsx
import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;