import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Messages() {
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState({ receiver: '', content: '' });

  useEffect(() => {
    api.get('messages/').then(res => setMsgs(res.data));
  }, []);

  const sendMsg = async (e) => {
    e.preventDefault();
    await api.post('messages/', newMsg);
    alert("Message sent!");
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-black">Inbox</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* List of Messages */}
        <div className="space-y-4">
          {msgs.map(m => (
            <div key={m.id} className="p-4 bg-white border rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-green-600">From: {m.sender_name}</p>
              <p className="text-sm text-gray-700 mt-1">{m.content}</p>
              <p className="text-[10px] text-gray-400 mt-2">{new Date(m.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Quick Send Form */}
        <form onSubmit={sendMsg} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg h-fit">
          <h3 className="font-bold mb-4">Send a New Message</h3>
          <input 
            type="number" 
            placeholder="Receiver User ID" 
            className="w-full p-2 border rounded-xl mb-4"
            onChange={e => setNewMsg({...newMsg, receiver: e.target.value})}
          />
          <textarea 
            placeholder="Your message..." 
            className="w-full p-2 border rounded-xl mb-4"
            onChange={e => setNewMsg({...newMsg, content: e.target.value})}
          />
          <button className="w-full bg-green-600 text-white py-2 rounded-xl font-bold">Send Message</button>
        </form>
      </div>
    </div>
  );
}