import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Electronics', 'ID Cards', 'Clothing', 'Books', 'Keys', 'Other'];

export default function SubmitFound() {
  const { addItem } = useAppContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    date: '',
    location: '',
    storedLocation: '',
    description: '',
    image: null
  });
  
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFormData(prev => ({ ...prev, image: url }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem({
      ...formData,
      type: 'found',
      submittedBy: currentUser.id
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Found Item Submitted</h2>
          <p className="text-gray-600">
            Thank you for helping our community! The item is now listed on the feed for students to claim.
          </p>
          <div className="pt-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
            >
              Back to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submit Found Item</h1>
        <p className="text-gray-500 text-sm">Thank you for reporting a found item. Please provide details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Item Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. Car Keys"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date Found *</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Location Found *</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. Main Entrance"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Where is the item currently stored? *</label>
            <input
              type="text"
              name="storedLocation"
              required
              value={formData.storedLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. Security Desk, Library Front Desk"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 resize-none"
            placeholder="Describe the item's appearance without giving away proof of ownership details if possible."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Upload Photo (Recommended)</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
              <span>Choose File</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
            <span className="text-sm text-gray-500">
              {formData.image ? 'Photo selected' : 'No file chosen'}
            </span>
          </div>
          {preview && (
            <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Submit Item
          </button>
        </div>
      </form>
    </div>
  );
}
