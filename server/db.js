import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        client_name TEXT NOT NULL,
        service TEXT NOT NULL,
        barber_id TEXT NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function getAvailableSlots(date, barberId) {
  try {
    const rows = await sql`
      SELECT time::text 
      FROM appointments 
      WHERE date = ${date} 
      AND barber_id = ${barberId}
    `;
    
    const bookedTimes = new Set(rows.map(row => row.time));
    const slots = [];
    
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (!bookedTimes.has(time)) {
          slots.push(time);
        }
      }
    }
    
    return slots;
  } catch (error) {
    console.error('Error getting available slots:', error);
    throw error;
  }
}

export async function createAppointment(appointment) {
  try {
    const { clientName, service, barberId, date, time } = appointment;
    const result = await sql`
      INSERT INTO appointments (client_name, service, barber_id, date, time)
      VALUES (${clientName}, ${service}, ${barberId}, ${date}, ${time})
      RETURNING id
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function getAppointments() {
  try {
    return await sql`
      SELECT * 
      FROM appointments 
      ORDER BY date, time
    `;
  } catch (error) {
    console.error('Error getting appointments:', error);
    throw error;
  }
}