import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', role: 'renter', phone: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('register/', formData);
    alert("Registration Successful! Please login.");
    navigate('/login');
  } catch (err) {
    // Check if the server actually sent a response
    if (err.response) {
      // The server responded with a status code (400, 500, etc.)
      alert("Registration Failed: " + JSON.stringify(err.response.data));
    } else if (err.request) {
      // The request was made but no response was received
      alert("Server is not responding. Is the Django backend running?");
    } else {
      // Something else happened
      alert("Error: " + err.message);
    }
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Username" required className="w-full p-2 border rounded"
          onChange={e => setFormData({...formData, username: e.target.value})} />
        
        <input type="email" placeholder="Email" required className="w-full p-2 border rounded"
          onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <input type="password" placeholder="Password" required className="w-full p-2 border rounded"
          onChange={e => setFormData({...formData, password: e.target.value})} />
        
        <input type="text" placeholder="Phone Number" className="w-full p-2 border rounded"
          onChange={e => setFormData({...formData, phone: e.target.value})} />

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">I want to be a:</label>
          <select className="w-full p-2 border rounded bg-white" 
            value={formData.role} 
            onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="renter">Renter (I want to borrow items)</option>
            <option value="owner">Owner (I want to rent out items)</option>
          </select>
        </div>

        <button className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}