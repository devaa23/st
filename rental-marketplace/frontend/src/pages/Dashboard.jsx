import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('bookings/');
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`bookings/${id}/`, { status });
      alert(`Rental request ${status}!`);
      fetchBookings(); // Refresh list
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="text-center py-20">Loading your dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-500">Manage your items and rental requests.</p>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-2xl">
          <span className="text-green-700 font-bold text-sm">
            Total Requests: {bookings.length}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-400 text-sm uppercase mb-4 tracking-widest">Revenue Status</h3>
            <p className="text-4xl font-black text-gray-900">Coming Soon</p>
            <p className="text-xs text-gray-400 mt-2 italic">Payment integration in next phase.</p>
          </div>
          
          <div className="bg-green-600 p-6 rounded-3xl text-white shadow-xl">
            <h3 className="font-bold text-green-100 text-sm uppercase mb-2">Pro Tip</h3>
            <p className="text-sm">Respond to requests within 2 hours to increase your "Trust Score" among renters.</p>
          </div>
        </div>

        {/* Requests Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Incoming Requests
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">New</span>
          </h2>

          {bookings.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 p-12 rounded-3xl text-center text-gray-400">
              No rental requests yet.
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:border-green-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{booking.item_name}</h4>
                    <p className="text-sm text-gray-500">From: <span className="font-semibold text-gray-700">{booking.renter_name}</span></p>
                    <p className="text-xs text-gray-400 mt-1">📅 {booking.start_date} to {booking.end_date}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    booking.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {booking.status}
                  </span>

                  {booking.status === 'pending' && (
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => updateStatus(booking.id, 'approved')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => updateStatus(booking.id, 'rejected')}
                        className="flex-1 bg-white text-gray-400 border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}