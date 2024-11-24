import React from 'react';
import { Service } from './ServiceSelector';

export interface Appointment {
  id: number;
  clientName: string;
  service: string;
  date: string;
  time: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  services: Service[];
  isLoading: boolean;
  error: string | null;
}

export function AppointmentList({ appointments, services, isLoading, error }: AppointmentListProps) {
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Failed to load appointments: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-gray-500">
        Loading appointments...
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        No appointments scheduled yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="p-4 border rounded-lg hover:border-indigo-600 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{appointment.clientName}</p>
              <p className="text-sm text-gray-500">
                {services.find((s) => s.id === appointment.service)?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{appointment.date}</p>
              <p className="text-sm text-gray-500">{appointment.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}