import { useState } from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';

export default function ItemCard({ item, onClaim }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Photo
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-white/90 text-xs font-semibold rounded text-primary-700 backdrop-blur-sm shadow-sm">
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{item.title}</h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {new Date(item.date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
        {onClaim && (
          <button
            onClick={() => onClaim(item)}
            className="w-full py-2 px-4 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            This might be mine
          </button>
        )}
      </div>
    </div>
  );
}
