const prisma = require("../db/prisma");

exports.getUserAppointments = async (userId) => {
  try {
    const appointmets = await prisma.appointment.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      include: {
        timeBlock: true,
      },
    });
    return appointmets;
  } catch (error) {
    throw new Error("Error al obtener el historial de citas");
  }
};