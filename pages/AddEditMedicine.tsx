
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Medicine, MedicineFrequency } from '../types';
import { Clock, Calendar, FileText, ChevronLeft, Plus, X } from 'lucide-react';

interface AddEditMedicineProps {
  userId: string;
  onSave: (med: Medicine) => void;
  existingMedicines: Medicine[];
}

const AddEditMedicine: React.FC<AddEditMedicineProps> = ({ userId, onSave, existingMedicines }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '',
    dosage: '',
    frequency: MedicineFrequency.ONCE_DAILY,
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isEditing) {
      const med = existingMedicines.find(m => m.id === id);
      if (med) setFormData(med);
    }
  }, [id, isEditing, existingMedicines]);

  const addTimeSlot = () => {
    setFormData(prev => ({ ...prev, times: [...(prev.times || []), '12:00'] }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({ ...prev, times: prev.times?.filter((_, i) => i !== index) }));
  };

  const updateTime = (index: number, val: string) => {
    const newTimes = [...(formData.times || [])];
    newTimes[index] = val;
    setFormData(prev => ({ ...prev, times: newTimes }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage || !formData.times?.length) return;

    const medToSave: Medicine = {
      id: (formData.id || Math.random().toString(36).substr(2, 9)) as string,
      userId,
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency as MedicineFrequency,
      times: formData.times,
      startDate: formData.startDate as string,
      endDate: formData.endDate,
      notes: formData.notes,
      createdAt: formData.createdAt || Date.now()
    };

    onSave(medToSave);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-slate-800">{isEditing ? 'Edit Medicine' : 'New Reminder'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FileText size={16} /> Basic Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Medicine Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Paracetamol"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Dosage</label>
              <input
                required
                type="text"
                placeholder="e.g. 500mg / 1 Tablet"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.dosage}
                onChange={e => setFormData({ ...formData, dosage: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={16} /> Schedule
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Frequency</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.frequency}
                onChange={e => setFormData({ ...formData, frequency: e.target.value as MedicineFrequency })}
              >
                {Object.values(MedicineFrequency).map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Reminder Times</label>
              <div className="flex flex-wrap gap-3">
                {formData.times?.map((time, idx) => (
                  <div key={idx} className="relative group">
                    <input
                      type="time"
                      required
                      className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 font-bold rounded-xl outline-none"
                      value={time}
                      onChange={e => updateTime(idx, e.target.value)}
                    />
                    {formData.times!.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(idx)}
                        className="absolute -top-2 -right-2 bg-white text-rose-500 border border-rose-100 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl hover:border-blue-300 hover:text-blue-500 transition-all font-medium text-sm"
                >
                  <Plus size={16} /> Add Time
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={16} /> Duration
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Start Date</label>
              <input
                required
                type="date"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">End Date (Optional)</label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.endDate || ''}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Notes (Optional)</label>
          <textarea
            placeholder="e.g. Take after meal"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            {isEditing ? 'Save Changes' : 'Create Reminder'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditMedicine;
