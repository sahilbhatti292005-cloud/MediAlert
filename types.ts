
export enum MedicineFrequency {
  ONCE_DAILY = 'Once a day',
  TWICE_DAILY = 'Twice a day',
  CUSTOM = 'Custom'
}

export enum MedicineStatus {
  PENDING = 'Pending',
  TAKEN = 'Taken',
  MISSED = 'Missed',
  SNOOZED = 'Snoozed'
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Medicine {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: MedicineFrequency;
  times: string[]; // e.g. ["08:00", "20:00"]
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: number;
}

export interface MedicineLog {
  id: string;
  medicineId: string;
  userId: string;
  date: string; // ISO Date YYYY-MM-DD
  time: string; // HH:mm
  status: MedicineStatus;
  timestamp: number;
}

export interface ActiveReminder {
  medicine: Medicine;
  time: string;
}
