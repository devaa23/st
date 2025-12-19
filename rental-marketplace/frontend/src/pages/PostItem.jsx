import React, { useState } from 'react';
import api from '../api/axios';

export default function PostItem() {
    const [formData, setFormData] = useState({
        name: '', category: '', price_per_day: '', description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('items/', formData);
            alert("Item listed successfully!");
        } catch (err) {
            alert("Error: Only users with 'Owner' role can post.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">List an Item for Rent</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Item Name" className="w-full p-2 border rounded" 
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                
                <input type="number" placeholder="Price per Day (ETB)" className="w-full p-2 border rounded"
                    onChange={e => setFormData({...formData, price_per_day: e.target.value})} />
                
                <textarea placeholder="Description" className="w-full p-2 border rounded"
                    onChange={e => setFormData({...formData, description: e.target.value})} />
                
                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    Submit Listing
                </button>
            </form>
        </div>
    );
}