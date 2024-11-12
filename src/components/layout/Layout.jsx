import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserCircleIcon } from '@heroicons/react/24/outline';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="flex justify-end px-4 py-4">
              <button className="p-1">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;