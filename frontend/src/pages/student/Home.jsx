import { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ItemCard from '../../components/ItemCard';
import Modal from '../../components/Modal';
import { Search, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'ID Cards', 'Clothing', 'Books', 'Keys', 'Other'];

export default function Home() {
  const { items, addClaim } = useAppContext();
  const { currentUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [proof, setProof] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  // Filter to show only found items that are Open
  const foundItems = items.filter(item => item.type === 'found' && item.status === 'Open');

  const filteredItems = useMemo(() => {
    return foundItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [foundItems, searchTerm, category]);

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!proof.trim()) return;
    
    addClaim({
      itemId: selectedItem.id,
      claimantId: currentUser.id,
      proof
    });
    setClaimSubmitted(true);
  };

  const closeClaimModal = () => {
    setSelectedItem(null);
    setProof('');
    setClaimSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Found Items Feed</h1>
          <p className="text-gray-500 text-sm">Browse items found across campus.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
            />
          </div>
          
          <div className="relative flex items-center">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white w-full sm:w-auto"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
          <p className="text-gray-500">No items found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onClaim={setSelectedItem} />
          ))}
        </div>
      )}

      {/* Claim Modal */}
      <Modal 
        isOpen={!!selectedItem} 
        onClose={closeClaimModal}
        title={claimSubmitted ? "Claim Submitted" : "Claim Item"}
      >
        {claimSubmitted ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600">
              Your claim has been submitted and is pending admin review. You will be notified once it is processed.
            </p>
            <button
              onClick={closeClaimModal}
              className="mt-4 w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleClaimSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              You are claiming: <span className="font-semibold text-gray-900">{selectedItem?.title}</span>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proof of Ownership *
              </label>
              <textarea
                required
                rows={4}
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                placeholder="Describe specific details about the item (e.g., serial number, scratches, contents) to prove it belongs to you."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeClaimModal}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Submit Claim
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
