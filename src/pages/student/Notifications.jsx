import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead } = useAppContext();
  const { currentUser } = useAuth();

  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-600" />
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">Updates on your reported items and claims.</p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead(currentUser.id)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {userNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <p className="text-gray-500">You have no notifications yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {userNotifications.map((n) => (
              <li 
                key={n.id} 
                className={`p-4 transition-colors ${
                  !n.read ? 'bg-primary-50/50' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => !n.read && markNotificationRead(n.id)}
                style={{ cursor: !n.read ? 'pointer' : 'default' }}
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    {!n.read ? (
                      <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"></div>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-transparent rounded-full border border-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(n.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
