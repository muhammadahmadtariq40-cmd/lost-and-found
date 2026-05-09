import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, CheckCircle } from 'lucide-react';

export default function MyReports() {
  const { items, updateItemStatus, deleteItem } = useAppContext();
  const { currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('lost');

  const userItems = items.filter(item => item.submittedBy === currentUser.id);
  const lostItems = userItems.filter(item => item.type === 'lost');
  const foundItems = userItems.filter(item => item.type === 'found');

  const displayedItems = activeTab === 'lost' ? lostItems : foundItems;

  const StatusBadge = ({ status }) => {
    const colors = {
      Open: 'bg-blue-100 text-blue-800',
      Matched: 'bg-yellow-100 text-yellow-800',
      Resolved: 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.Open}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
        <p className="text-gray-500 text-sm">Manage the items you have reported lost or found.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('lost')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'lost'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Lost Reports ({lostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'found'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Found Submissions ({foundItems.length})
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {displayedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't submitted any {activeTab} items yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {displayedItems.map((item) => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-1">
                      No photo
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(item.date).toLocaleDateString()} • {item.location}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status !== 'Resolved' && (
                    <button
                      onClick={() => updateItemStatus(item.id, 'Resolved')}
                      className="flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      title="Mark as Resolved"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
