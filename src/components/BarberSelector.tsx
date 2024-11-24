import React from 'react';
import { Scissors } from 'lucide-react';

export interface Barber {
  id: string;
  name: string;
  specialties: string[];
  image: string;
}

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarber: Barber;
  onBarberSelect: (barber: Barber) => void;
}

export function BarberSelector({ barbers, selectedBarber, onBarberSelect }: BarberSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Select Barber</label>
      <div className="mt-1 grid grid-cols-2 gap-2">
        {barbers.map((barber) => (
          <button
            key={barber.id}
            type="button"
            onClick={() => onBarberSelect(barber)}
            className={`p-3 text-sm rounded-lg border ${
              selectedBarber.id === barber.id
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-indigo-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {barber.image ? (
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <div className="text-left">
                <div className="font-medium">{barber.name}</div>
                <div className="text-xs text-gray-500">
                  {barber.specialties.join(', ')}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}