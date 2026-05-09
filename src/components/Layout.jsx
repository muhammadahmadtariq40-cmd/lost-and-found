import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ role, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {role === 'admin' && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        {role === 'student' && <Navbar />}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
