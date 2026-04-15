
import React from 'react';
import { MedicineLog, Medicine, MedicineStatus } from '../types';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface HistoryProps {
  logs: MedicineLog[];
  medicines: Medicine[];
}

const History: React.FC<HistoryProps> = ({ logs, medicines }) => {
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  const getMedicineName = (id: string) => medicines.find(m => m.id === id)?.name || 'Unknown Medicine';

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">History Tracking</h2>
        <p className="text-slate-500">View your past medication records</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {sortedLogs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Calendar size={32} />
            </div>
            <p className="text-slate-500 font-medium">No history recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-800">{getMedicineName(log.medicineId)}</span>
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      <span className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {log.time}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        log.status === MedicineStatus.TAKEN ? 'bg-emerald-100 text-emerald-700' :
                        log.status === MedicineStatus.MISSED ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {log.status === MedicineStatus.TAKEN ? <CheckCircle size={12} /> : 
                         log.status === MedicineStatus.MISSED ? <XCircle size={12} /> : 
                         <Clock size={12} />}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
