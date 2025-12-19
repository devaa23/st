import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function DeliveryDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('deliveries/').then(res => setTasks(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`deliveries/${id}/`, { status });
    alert("Status Updated!");
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-black">Delivery Tasks</h1>
      <div className="grid gap-4">
        {tasks.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-lg">{t.booking_item_name}</p>
              <p className="text-sm text-gray-500">Pickup from Owner: {t.owner_name}</p>
              <p className="text-sm text-gray-500 font-bold">Status: {t.status}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateStatus(t.id, 'in_transit')} className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-xs font-bold">Pick Up</button>
              <button onClick={() => updateStatus(t.id, 'delivered')} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Mark Delivered</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}