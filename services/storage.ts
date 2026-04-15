
import { User, Medicine, MedicineLog } from '../types';

const KEYS = {
  USERS: 'medialert_users',
  CURRENT_USER: 'medialert_current_user',
  MEDICINES: 'medialert_medicines',
  LOGS: 'medialert_logs'
};

export const StorageService = {
  // Auth
  saveUser: (user: any) => {
    const users = StorageService.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  getUsers: (): any[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  // Medicines
  saveMedicine: (medicine: Medicine) => {
    const medicines = StorageService.getMedicines();
    const index = medicines.findIndex(m => m.id === medicine.id);
    if (index > -1) {
      medicines[index] = medicine;
    } else {
      medicines.push(medicine);
    }
    localStorage.setItem(KEYS.MEDICINES, JSON.stringify(medicines));
  },
  getMedicines: (): Medicine[] => {
    const data = localStorage.getItem(KEYS.MEDICINES);
    return data ? JSON.parse(data) : [];
  },
  deleteMedicine: (id: string) => {
    const medicines = StorageService.getMedicines().filter(m => m.id !== id);
    localStorage.setItem(KEYS.MEDICINES, JSON.stringify(medicines));
  },

  // Logs
  saveLog: (log: MedicineLog) => {
    const logs = StorageService.getLogs();
    logs.push(log);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  },
  getLogs: (): MedicineLog[] => {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  }
};
