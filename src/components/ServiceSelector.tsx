import React from 'react';

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service;
  onServiceSelect: (service: Service) => void;
}

export function ServiceSelector({ services, selectedService, onServiceSelect }: ServiceSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Service</label>
      <div className="mt-1 grid grid-cols-2 gap-2">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => onServiceSelect(service)}
            className={`p-3 text-sm rounded-lg border ${
              selectedService.id === service.id
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-indigo-600'
            }`}
          >
            <div className="font-medium">{service.name}</div>
            <div className="text-xs text-gray-500">${service.price}</div>
          </button>
        ))}
      </div>
    </div>
  );
}