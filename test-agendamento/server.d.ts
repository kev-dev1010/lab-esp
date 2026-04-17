export type Slot = {
  time: string;
  available: boolean;
};

export type Appointment = {
  id: string;
  name: string;
  contact: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  customerMessage: string;
  adminReply: string;
  createdAt: string;
  updatedAt?: string;
};

export type Database = {
  businessHours: {
    startHour: number;
    endHour: number;
    slotMinutes: number;
  };
  workingDays: number[];
  services: Array<{
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  }>;
  appointments: Appointment[];
};

export function loadSeedDatabase(): Promise<Database>;
export function getAvailabilityForDate(
  database: Database,
  dateValue: string
): Slot[];
export function createAppointment(
  database: Database,
  payload: {
    serviceId: string;
    name: string;
    contact: string;
    date: string;
    time: string;
    customerMessage?: string;
  }
): Appointment;
export function updateAppointment(
  database: Database,
  appointmentId: string,
  payload: {
    action: string;
    message?: string;
  }
): Appointment;
