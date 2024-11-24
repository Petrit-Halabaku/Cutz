import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Scissors, User } from 'lucide-react';
import { format } from 'date-fns';
import { ServiceSelector } from './components/ServiceSelector';
import { BarberSelector } from './components/BarberSelector';
import { AppointmentList } from './components/AppointmentList';
import { ConfirmationModal } from './components/ConfirmationModal';
import { fetchAvailableSlots, fetchAppointments, bookAppointment } from './api/appointments';

const services = [
  { id: 'haircut', name: 'Haircut', duration: 30, price: 30 },
  { id: 'beard-trim', name: 'Beard Trim', duration: 15, price: 20 },
  { id: 'shave', name: 'Clean Shave', duration: 30, price: 25 },
  { id: 'combo', name: 'Haircut & Beard Trim', duration: 45, price: 45 },
];

const barbers = [
  {
    id: 'john',
    name: 'John Smith',
    specialties: ['Classic Cuts', 'Fades'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200',
  },
  {
    id: 'mike',
    name: 'Mike Johnson',
    specialties: ['Beard Styling', 'Hot Towel Shave'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200',
  },
  {
    id: 'sarah',
    name: 'Sarah Williams',
    specialties: ['Modern Styles', 'Hair Design'],
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&h=200',
  },
  {
    id: 'david',
    name: 'David Brown',
    specialties: ['Traditional Cuts', 'Straight Razor Shave'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200',
  },
];

function App() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    async function loadSlots() {
      setIsLoadingSlots(true);
      setSlotsError(null);
      try {
        const slots = await fetchAvailableSlots(selectedDate, selectedBarber.id);
        setAvailableSlots(slots);
      } catch (error) {
        setSlotsError(error instanceof Error ? error.message : 'Failed to load slots');
      } finally {
        setIsLoadingSlots(false);
      }
    }

    loadSlots();
  }, [selectedDate, selectedBarber.id]);

  useEffect(() => {
    async function loadAppointments() {
      setIsLoadingAppointments(true);
      setAppointmentsError(null);
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (error) {
        setAppointmentsError(error instanceof Error ? error.message : 'Failed to load appointments');
      } finally {
        setIsLoadingAppointments(false);
      }
    }

    loadAppointments();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !clientName) return;
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    try {
      await bookAppointment({
        clientName,
        service: selectedService.id,
        barberId: selectedBarber.id,
        date: selectedDate,
        time: selectedTime,
      });

      setBookingSuccess(true);
      setClientName('');
      setSelectedTime('');
      setShowConfirmation(false);
      
      // Refresh data
      const [slots, appointments] = await Promise.all([
        fetchAvailableSlots(selectedDate, selectedBarber.id),
        fetchAppointments(),
      ]);
      
      setAvailableSlots(slots);
      setAppointments(appointments);
      
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Barber Shop Scheduler</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Book an Appointment</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <ServiceSelector
                services={services}
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
              />

              <BarberSelector
                barbers={barbers}
                selectedBarber={selectedBarber}
                onBarberSelect={setSelectedBarber}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Available Times</span>
                  </div>
                </label>
                {slotsError ? (
                  <div className="mt-1 p-4 bg-red-50 text-red-700 rounded-md">
                    {slotsError}
                  </div>
                ) : isLoadingSlots ? (
                  <div className="mt-1 p-4 text-gray-500">
                    Loading available times...
                  </div>
                ) : (
                  <div className="mt-1 grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2 text-sm rounded-lg border ${
                          selectedTime === slot
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-200 hover:border-indigo-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Your Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isBooking || !selectedTime || !clientName}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isBooking ? 'Booking...' : 'Book Appointment'}
              </button>

              {bookingSuccess && (
                <div className="p-4 bg-green-50 text-green-700 rounded-md">
                  Appointment booked successfully!
                </div>
              )}
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
            <AppointmentList
              appointments={appointments}
              services={services}
              isLoading={isLoadingAppointments}
              error={appointmentsError}
            />
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmBooking}
        clientName={clientName}
        selectedService={selectedService}
        selectedBarber={selectedBarber}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
}

export default App;