import express from 'express';
import cors from 'cors';
import { initializeDatabase, getAvailableSlots, createAppointment, getAppointments } from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database on startup
initializeDatabase().catch(console.error);

// Get available time slots
app.get('/api/slots/:date/:barberId', async (req, res) => {
  try {
    const { date, barberId } = req.params;
    const slots = await getAvailableSlots(date, barberId);
    res.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

// Book appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = await createAppointment(req.body);
    res.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ error: 'Failed to create appointment' });
  }
});

// Get appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await getAppointments();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});