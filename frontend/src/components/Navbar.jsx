import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { Home, PlusCircle, Search, List, Bell, LogOut } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { notifications } = useAppContext();
  const location = useLocation();

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  const links = [
    { name: 'Feed', path: '/', icon: Home },
    { name: 'Report Lost', path: '/report-lost', icon: Search },
    { name: 'Submit Found', path: '/submit-found', icon: PlusCircle },
    { name: 'My Reports', path: '/my-reports', icon: List },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <nav className="bg-primary-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary-300">UniFind</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    isActive ? 'bg-primary-800 text-white' : 'text-primary-100 hover:bg-primary-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.name}
                  {link.badge > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm hidden sm:block text-primary-200">Hi, {currentUser.name}</span>
            <button
              onClick={logout}
              className="flex items-center text-primary-100 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex md:hidden overflow-x-auto pb-3 pt-1 space-x-2 scrollbar-hide no-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex shrink-0 items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  isActive ? 'bg-primary-800 text-white' : 'text-primary-100 hover:bg-primary-800'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {link.name}
                {link.badge > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
