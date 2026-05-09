import { useAppContext } from '../../context/AppContext';
import { Package, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminOverview() {
  const { items, claims } = useAppContext();

  const totalLost = items.filter(i => i.type === 'lost').length;
  const totalFound = items.filter(i => i.type === 'found').length;
  const pendingClaims = claims.filter(c => c.status === 'Pending').length;
  
  // Mock logic for "resolved this week" (just counting all resolved for now)
  const resolvedItems = items.filter(i => i.status === 'Resolved').length;

  const stats = [
    { name: 'Total Lost Reports', value: totalLost, icon: Search, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Found Submissions', value: totalFound, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Pending Claims', value: pendingClaims, icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Items Resolved', value: resolvedItems, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back, Administrator. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div className={`p-4 rounded-lg ${stat.bg} ${stat.color} mr-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500 text-sm">
            Activity feed would appear here in a real application.
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm font-medium text-gray-700">
              Review Pending Claims ({pendingClaims})
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm font-medium text-gray-700">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
