
import React, { useEffect, useState } from 'react';
import { ActiveReminder, MedicineStatus } from '../types';
import { Pill, Clock, Check, BellRing } from 'lucide-react';
import { NotificationService } from '../services/notification';

interface ReminderModalProps {
  reminder: ActiveReminder;
  onAction: (status: MedicineStatus) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ reminder, onAction }) => {
  const [sound, setSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Start sound on mount
    const audio = NotificationService.playAlertSound();
    setSound(audio);

    // Stop sound on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const handleAction = (status: MedicineStatus) => {
    if (sound) {
      sound.pause();
    }
    onAction(status);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"></div>
      <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Animated Background Pulse */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-blue-600 overflow-hidden">
          <div className="absolute inset-0 opacity-20 animate-pulse">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center mb-3 animate-bounce">
              <Pill size={40} />
            </div>
            <h2 className="text-2xl font-black">Medicine Reminder</h2>
          </div>
        </div>

        <div className="pt-52 px-10 pb-12 space-y-8 text-center">
          <div>
            <h3 className="text-3xl font-black text-slate-800 mb-2">{reminder.medicine.name}</h3>
            <p className="text-xl text-blue-600 font-bold">{reminder.medicine.dosage}</p>
          </div>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
              <p className="text-xl font-black text-slate-800 flex items-center gap-2 justify-center">
                <Clock size={20} className="text-blue-500" />
                {reminder.time}
              </p>
            </div>
            {reminder.medicine.notes && (
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Note</p>
                <p className="text-sm font-medium text-slate-600 italic">"{reminder.medicine.notes}"</p>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4">
            <button
              onClick={() => handleAction(MedicineStatus.TAKEN)}
              className="w-full py-5 bg-emerald-500 text-white rounded-[24px] font-black text-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Check size={28} />
              Mark as Taken
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAction(MedicineStatus.SNOOZED)}
                className="py-4 bg-slate-100 text-slate-600 rounded-[24px] font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <BellRing size={20} />
                Snooze
              </button>
              <button
                onClick={() => handleAction(MedicineStatus.MISSED)}
                className="py-4 border-2 border-slate-100 text-slate-400 rounded-[24px] font-bold text-lg hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95"
              >
                Skip Dose
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
