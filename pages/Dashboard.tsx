
import React, { useMemo } from 'react';
import { Medicine, MedicineLog, MedicineStatus } from '../types';
// Added PlusCircle to the list of icons imported from lucide-react
import { CheckCircle, Clock, AlertCircle, Trash2, Edit2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  medicines: Medicine[];
  logs: MedicineLog[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ medicines, logs, onDelete }) => {
  const today = new Date().toISOString().split('T')[0];

  const todaySchedule = useMemo(() => {
    return medicines.flatMap(med => {
      // Basic check for start/end date
      if (med.startDate > today) return [];
      if (med.endDate && med.endDate < today) return [];

      return med.times.map(time => {
        const log = logs.find(l => l.medicineId === med.id && l.date === today && l.time === time);
        return {
          ...med,
          scheduledTime: time,
          status: log ? log.status : (time < new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) ? MedicineStatus.MISSED : MedicineStatus.PENDING)
        };
      });
    }).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [medicines, logs, today]);

  const stats = useMemo(() => {
    const total = todaySchedule.length;
    const taken = todaySchedule.filter(s => s.status === MedicineStatus.TAKEN).length;
    const missed = todaySchedule.filter(s => s.status === MedicineStatus.MISSED).length;
    const pending = total - taken - missed;
    return { total, taken, missed, pending };
  }, [todaySchedule]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'blue', icon: Clock },
          { label: 'Taken', value: stats.taken, color: 'emerald', icon: CheckCircle },
          { label: 'Pending', value: stats.pending, color: 'amber', icon: AlertCircle },
          { label: 'Missed', value: stats.missed, color: 'rose', icon: AlertCircle },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4`}>
            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Today's Schedule</h3>
            <span className="text-sm text-slate-500 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Clock size={40} />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">No medicines scheduled</h4>
              <p className="text-slate-500 max-w-xs mx-auto mb-6">You haven't added any medicines for today yet.</p>
              <Link to="/add" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                <PlusCircle size={20} />
                Add Medicine
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${
                      item.status === MedicineStatus.TAKEN ? 'bg-emerald-50 text-emerald-600' :
                      item.status === MedicineStatus.MISSED ? 'bg-rose-50 text-rose-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      <span className="text-lg font-bold leading-none">{item.scheduledTime}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{item.name}</h4>
                      <p className="text-slate-500 text-sm flex items-center gap-1.5">
                        {item.dosage} • {item.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.status === MedicineStatus.TAKEN ? 'bg-emerald-100 text-emerald-700' :
                      item.status === MedicineStatus.MISSED ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Medicines Inventory */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 mb-6">All Medicines</h3>
          {medicines.length === 0 ? (
            <p className="text-slate-400 text-sm italic">Inventory is empty.</p>
          ) : (
            <div className="grid gap-4">
              {medicines.map((med) => (
                <div key={med.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-slate-800">{med.name}</h5>
                    <div className="flex gap-2">
                      <Link to={`/edit/${med.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => onDelete(med.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    <p>Dosage: <span className="text-slate-800 font-medium">{med.dosage}</span></p>
                    <p>Schedule: <span className="text-slate-800 font-medium">{med.times.join(', ')}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
