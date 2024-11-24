import React from 'react';
import { X } from 'lucide-react';
import { Service } from './ServiceSelector';
import { Barber } from './BarberSelector';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
  selectedService: Service;
  selectedBarber: Barber;
  selectedDate: string;
  selectedTime: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  selectedService,
  selectedBarber,
  selectedDate,
  selectedTime,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h3 className="text-lg font-semibold mb-4">Confirm Your Appointment</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{selectedService.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">${selectedService.price}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Barber:</span>
            <span className="font-medium">{selectedBarber.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{selectedDate}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{selectedTime}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Client:</span>
            <span className="font-medium">{clientName}</span>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}