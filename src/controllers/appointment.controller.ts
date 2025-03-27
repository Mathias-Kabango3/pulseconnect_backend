import prisma from '../lib/prisma';
import { Request, Response } from 'express';

export const getAvailableSlots = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    res.status(400).json({ error: 'Doctor ID and date are required' });
    return;
  }

  // Fetch doctor's availability
  const doctor = await prisma.doctor.findUnique({
    where: { id: parseInt(doctorId as string) },
    select: { availableFrom: true, availableTo: true },
  });

  if (!doctor) {
    res.status(404).json({ error: 'Doctor not found' });
    return;
  }

  const { availableFrom, availableTo } = doctor;
  if (!availableFrom || !availableTo) {
    throw new Error("Doctor's working hours are missing");
  }

  // Convert availableFrom & availableTo to Date objects on the selected date
  const selectedDate = new Date(date as string);
  const [startHour, startMinute] = availableFrom.split(':').map(Number);
  const [endHour, endMinute] = availableTo.split(':').map(Number);

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(startHour, startMinute, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(endHour, endMinute, 0, 0);

  if (endMinute === 0) {
    endOfDay.setHours(endHour - 0, 59, 59, 999);
  }

  // Generate 1-hour time slots
  const possibleSlots = [];
  let currentSlot = new Date(startOfDay);

  while (currentSlot < endOfDay) {
    const slotEnd = new Date(currentSlot);
    slotEnd.setHours(slotEnd.getHours() + 1);

    if (slotEnd > endOfDay) break;

    possibleSlots.push({
      startTime: new Date(currentSlot),
      endTime: new Date(slotEnd),
    });

    currentSlot = slotEnd;
  }

  // Fetch booked appointments for the given date
  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: parseInt(doctorId as string),
      date: selectedDate,
    },
    select: { startTime: true, endTime: true },
  });

  const availableSlots = possibleSlots.filter((slot) => {
    return !bookedAppointments.some(
      (booked) =>
        booked.startTime &&
        booked.endTime &&
        booked.startTime.getTime() < slot.endTime.getTime() &&
        booked.endTime.getTime() > slot.startTime.getTime()
    );
  });

  res.json(availableSlots);
};

export const bookAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { doctorId, userId, date, startTime } = req.body;

  if (!doctorId || !userId || !date || !startTime) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    res
      .status(400)
      .json({ error: 'Cannot book an appointment for a past date' });
    return;
  }

  const startDateTime = new Date(startTime);
  const endDateTime = new Date(startDateTime);
  endDateTime.setHours(endDateTime.getHours() + 1);

  // Ensure the slot isn't already booked
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      doctorId: parseInt(doctorId),
      date: selectedDate,
      startTime: startDateTime,
    },
  });

  if (existingAppointment) {
    res.status(400).json({ error: 'This time slot is already booked' });
    return;
  }

  const doctor = await prisma.doctor.findFirst({
    where: { id: parseInt(doctorId) },
    select: { hospitalId: true },
  });

  if (!doctor || !doctor.hospitalId) {
    res
      .status(400)
      .json({ error: 'Doctor or hospital information is missing' });
    return;
  }

  // Get the patient Id from the patients table
  const patient = await prisma.patient.findFirst({
    where: { userId: parseInt(userId) },
    select: { id: true },
  });

  if (!patient) {
    res.status(400).json({ error: 'Patient not found' });
    return;
  }

  console.log(patient.id);

  // Create new appointment
  const appointment = await prisma.appointment.create({
    data: {
      doctorId: parseInt(doctorId),
      patientId: patient.id,
      date: selectedDate,
      hospitalId: doctor.hospitalId,
      startTime: startDateTime,
      endTime: endDateTime,
    },
  });

  res
    .status(201)
    .json({ message: 'Appointment booked successfully', appointment });
};

export const deleteAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { appointmentId } = req.params;

  // Check if the appointment exists
  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(appointmentId) },
  });

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  // Delete the appointment
  await prisma.appointment.delete({
    where: { id: parseInt(appointmentId) },
  });

  res.json({ message: 'Appointment deleted successfully' });
};

export const updateAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { newStatus } = req.body;

  // Check if the appointment exists
  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(id) },
  });

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  // Update the appointment
  const updatedAppointment = await prisma.appointment.update({
    where: { id: parseInt(id) },
    data: {
      status: newStatus,
    },
  });

  res.status(200).json({
    message: 'Appointment updated successfully',
    updatedAppointment,
  });
};

export const myAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  const patient = await prisma.patient.findUnique({
    where: { userId: parseInt(userId) },
    select: { id: true },
  });
  if (!patient) {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      doctor: {
        select: {
          speciality: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePicture: true,
              email: true,
            },
          },
          hospital: {
            select: {
              name: true,
              imageUrl: true,
              address: {
                select: {
                  street: true,
                  city: true,
                  state: true,
                },
              },
            },
          },
        },
      },
    },
  });
  res.status(200).json(appointments);
};
