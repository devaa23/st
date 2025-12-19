import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const CATEGORIES = ['All', 'Tools', 'Electronics', 'Vehicles', 'Furniture', 'Recreation'];

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('items/');
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
    } finally {
      setLoading(false);
    }
  };

  // Logic to send a rental request (Requirement FR6)
  const handleRentRequest = async (itemId) => {
    const startDate = prompt("Enter Start Date (YYYY-MM-DD):");
    const endDate = prompt("Enter End Date (YYYY-MM-DD):");

    if (!startDate || !endDate) return;

    try {
      await api.post('bookings/', {
        item: itemId,
        start_date: startDate,
        end_date: endDate
      });
      alert("Request sent successfully! Check 'My Rentals' for updates.");
    } catch (err) {
      alert("Error: You must be logged in as a Renter to book.");
    }
  };

  // Filter Logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="text-center py-20 text-gray-500 font-bold">Loading Marketplace...</div>;

  return (
    <div className="space-y-10">
      {/* Search & Hero */}
      <section className="text-center space-y-4 py-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900">
          Find what you <span className="text-green-600">need.</span>
        </h1>
        <div className="max-w-xl mx-auto mt-6">
          <input 
            type="text"
            placeholder="Search tools, cameras, gear..."
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-white text-gray-500 border border-gray-100 hover:border-green-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              <img 
                src={item.image || 'https://via.placeholder.com/400x300'} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={item.name} 
              />
              <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-black uppercase text-gray-600">
                {item.category}
              </div>
            </div>
            
            <div className="p-5">
              {item.avg_rating && (
                <div className="flex items-center gap-1 text-yellow-500 text-xs font-black mb-1">
                  <span>★</span> <span>{item.avg_rating.toFixed(1)}</span>
                </div>
              )}
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <p className="text-gray-400 text-xs mt-1 line-clamp-1">{item.description}</p>
              
              <div className="mt-4 flex justify-between items-center border-t border-gray-50 pt-4">
                <div>
                  <span className="text-lg font-black text-gray-900">{item.price_per_day}</span>
                  <span className="text-[10px] text-gray-400 font-bold ml-1">ETB/day</span>
                </div>
                <button 
                  onClick={() => handleRentRequest(item.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors"
                >
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}