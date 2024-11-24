import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-production-api-url.com/api'  // You'll need to update this with your actual API URL
  : 'http://localhost:3000/api';

export async function fetchAvailableSlots(date: string, barberId: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/slots/${date}/${barberId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch available slots');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Could not load available time slots');
  }
}

export async function fetchAppointments() {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Could not load appointments');
  }
}

export async function bookAppointment(data: {
  clientName: string;
  service: string;
  barberId: string;
  date: string;
  time: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to book appointment');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error('Could not book the appointment');
  }
}