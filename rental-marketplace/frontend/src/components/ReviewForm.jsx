import React, { useState } from 'react';
import api from '../api/axios';

export default function ReviewForm({ bookingId, onComplete }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('reviews/', {
        booking: bookingId,
        rating: rating,
        comment: comment
      });
      alert("Thank you for your feedback!");
      onComplete();
    } catch (err) {
      alert("You have already reviewed this booking or there was an error.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-2xl mt-4 space-y-3 border border-gray-100">
      <h4 className="text-sm font-bold text-gray-700">Rate your experience</h4>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRating(num)}
            className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
              rating >= num ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea 
        placeholder="Write a comment..."
        className="w-full p-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400"
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button className="w-full bg-gray-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 transition-colors">
        Submit Review
      </button>
    </form>
  );
}