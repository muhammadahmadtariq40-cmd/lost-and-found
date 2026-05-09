import { useAppContext } from '../../context/AppContext';
import { Check, X } from 'lucide-react';

export default function ManageClaims() {
  const { claims, items, users, updateClaimStatus, updateItemStatus, addNotification } = useAppContext();

  const getItem = (id) => items.find(i => i.id === id);
  const getUser = (id) => users.find(u => u.id === id);

  const handleApprove = (claim) => {
    updateClaimStatus(claim.id, 'Approved');
    updateItemStatus(claim.itemId, 'Resolved');
    
    const item = getItem(claim.itemId);
    addNotification({
      userId: claim.claimantId,
      message: `Your claim for "${item?.title}" has been approved! Please visit the stored location to pick it up.`
    });
  };

  const handleReject = (claim) => {
    updateClaimStatus(claim.id, 'Rejected');
    
    const item = getItem(claim.itemId);
    addNotification({
      userId: claim.claimantId,
      message: `Your claim for "${item?.title}" has been rejected after review. If you believe this is a mistake, please contact administration.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Claims</h1>
        <p className="text-gray-500 text-sm">Review ownership claims submitted by students.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Proof Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => {
                const item = getItem(claim.itemId);
                const claimant = getUser(claim.claimantId);
                
                return (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item ? item.title : 'Deleted Item'}</div>
                      <div className="text-xs text-gray-500 mt-1">{item ? item.category : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{claimant ? claimant.name : 'Unknown User'}</div>
                      <div className="text-xs text-gray-500 mt-1">{claimant ? claimant.email : ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 line-clamp-3" title={claim.proof}>
                        {claim.proof}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        claim.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                        claim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {claim.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApprove(claim)}
                            className="flex items-center px-2 py-1 text-green-700 bg-green-50 rounded hover:bg-green-100 transition-colors"
                            title="Approve Claim"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(claim)}
                            className="flex items-center px-2 py-1 text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
                            title="Reject Claim"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {claims.length === 0 && (
            <div className="text-center py-8 text-gray-500">No claims have been submitted yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
