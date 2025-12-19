import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function SupportDashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get('complaints/').then(res => setComplaints(res.data));
  }, []);

  const resolve = async (id) => {
    await api.patch(`complaints/${id}/`, { status: 'resolved' });
    alert("Dispute Resolved!");
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-black">Support Tickets</h1>
      <div className="grid gap-4">
        {complaints.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-3xl border border-red-100 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-red-600 uppercase text-xs tracking-widest">{c.status}</p>
              <p className="text-gray-800 font-medium mt-1">"{c.reason}"</p>
              <p className="text-xs text-gray-400 mt-2">Filed by: {c.filed_by_name} vs {c.target_user_name}</p>
            </div>
            {c.status === 'open' && (
              <button onClick={() => resolve(c.id)} className="bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-bold">Resolve</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}