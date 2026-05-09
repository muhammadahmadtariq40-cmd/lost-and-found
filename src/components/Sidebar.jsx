import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ShieldCheck, Users, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Manage Items', path: '/manage-items', icon: Package },
    { name: 'Manage Claims', path: '/manage-claims', icon: ShieldCheck },
    { name: 'Manage Users', path: '/manage-users', icon: Users },
  ];

  return (
    <div className="w-16 md:w-64 shrink-0 bg-secondary-900 text-white flex flex-col min-h-screen transition-all">
      <div className="p-4 md:p-6 flex justify-center md:justify-start">
        <h1 className="text-2xl font-bold text-secondary-200 hidden md:block">Admin Portal</h1>
        <h1 className="text-2xl font-bold text-secondary-200 block md:hidden">AP</h1>
      </div>
      
      <nav className="flex-1 px-2 md:px-4 space-y-2 mt-4 md:mt-0">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center justify-center md:justify-start px-2 md:px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-secondary-800 text-white' : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'
              }`}
              title={link.name}
            >
              <Icon className="w-5 h-5 md:mr-3 shrink-0" />
              <span className="hidden md:inline">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 md:p-4 border-t border-secondary-800">
        <div className="mb-4 px-2 md:px-4 text-sm text-secondary-400 hidden md:block">
          Logged in as <br/>
          <span className="text-white font-medium truncate block">{currentUser.name}</span>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center md:justify-start px-2 md:px-4 py-2 text-secondary-300 hover:text-white transition-colors"
          title="Logout"
        >
          <LogOut className="w-6 h-6 md:w-5 md:h-5 md:mr-3 shrink-0" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
