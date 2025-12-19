import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      
      // Get user details (In Django, you'll need an endpoint for this)
      const userRes = await api.get('user-me/'); 
      setUser(userRes.data);
      
      navigate('/');
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="text" placeholder="Username" className="w-full p-2 border rounded"
          onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded"
          onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-green-600 text-white py-2 rounded font-bold">Login</button>
      </form>
    </div>
  );
}