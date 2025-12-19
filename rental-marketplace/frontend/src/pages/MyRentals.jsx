import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ReviewForm from '../components/ReviewForm';

export default function MyRentals() {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRentals();
  }, []);

  const fetchMyRentals = async () => {
    try {
      const res = await api.get('bookings/');
      setMyBookings(res.data);
    } catch (err) {
      console.error("Error fetching your rentals", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate total cost (End Date - Start Date * Price)
  const calculateTotal = (start, end, price) => {
    const s = new Date(start);
    const e = new Date(end);
    const days = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
    return days * price;
  };

  const handlePayment = async (booking) => {
    const totalAmount = calculateTotal(booking.start_date, booking.end_date, booking.price_per_day || 50);
    
    const confirmPay = window.confirm(`Confirm payment of ${totalAmount} ETB for this rental?`);
    if (!confirmPay) return;

    try {
      await api.post('payments/', {
        booking: booking.id,
        amount: totalAmount,
        transaction_id: "TXN-" + Math.floor(Math.random() * 10000000)
      });
      alert("Payment successful! Your rental is now confirmed.");
      fetchMyRentals(); // Refresh to show updated status
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-gray-900">My Rentals</h1>
        <p className="text-gray-500">Track your borrow requests and manage payments.</p>
      </header>

      <div className="grid gap-6">
        {myBookings.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 text-center">
            <p className="text-gray-400 font-bold mb-4">You haven't requested any items yet.</p>
            <a href="/" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-green-100">
              Browse Marketplace
            </a>
          </div>
        ) : (
          myBookings.map(booking => (
            <div key={booking.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Item Info */}
                <div className="flex gap-5">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl">
                    📦
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl leading-tight">{booking.item_name}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                      {booking.start_date} — {booking.end_date}
                    </p>
                    <div className="mt-2 text-sm">
                       <span className="text-gray-400 font-medium">Est. Total: </span>
                       <span className="text-gray-900 font-bold">{calculateTotal(booking.start_date, booking.end_date, booking.price_per_day || 50)} ETB</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                    booking.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                    booking.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {booking.status}
                  </span>

                  {/* ACTION: Pay (Only if Owner approved it) */}
                  {booking.status === 'approved' && (
                    <button 
                      onClick={() => handlePayment(booking)}
                      className="w-full md:w-auto bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-lg active:scale-95"
                    >
                      Pay & Confirm
                    </button>
                  )}

                  {/* ACTION: Status message */}
                  {booking.status === 'pending' && (
                    <p className="text-[10px] text-yellow-600 font-bold italic">Waiting for owner approval...</p>
                  )}
                </div>
              </div>

              {/* REVIEW SECTION: Only if the rental is 'completed' (paid) */}
              {booking.status === 'completed' && (
                <div className="mt-8 pt-6 border-t border-gray-50">
                  <ReviewForm 
                    bookingId={booking.id} 
                    onComplete={fetchMyRentals} 
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}