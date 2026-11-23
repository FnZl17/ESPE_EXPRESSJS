const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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