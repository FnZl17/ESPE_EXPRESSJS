const mongoose = require("mongoose");
const Course = require("../models/course");
const Comment = require("../models/comment");
const prisma = require("../db/prisma");
const { HttpError } = require("../utils/httpError");

// Crear en PostgreSQL validando MongoDB: el curso debe existir en el catálogo
const createEnrollment = async (userId, { courseId, amount }) => {
  if (!mongoose.isValidObjectId(courseId)) throw new HttpError(400, "El courseId no es un ObjectId válido");

  const course = await Course.findById(courseId).select("price");
  if (!course) throw new HttpError(404, "El curso no existe en el catálogo");

  // El monto sale del catálogo, no del cliente (el total debe ser exacto)
  // garantiza PostgreSQL: P2002 -> 409
  return prisma.enrollment.create({
    data: { userId, courseId: String(course._id), amount: course.price },
  });
};

// Consulta unida: matrículas (PostgreSQL) + datos del curso (MongoDB)
const listMyEnrollments = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const ids = [...new Set(enrollments.map((e) => e.courseId).filter(Boolean))];
  const courses = await Course.find({ _id: { $in: ids } }).select("title code level modules");
  const byId = new Map(courses.map((c) => [String(c._id), c]));

  return enrollments.map((e) => {
    const c = byId.get(e.courseId);
    return {
      ...e,
      course: c
        ? { id: c._id, title: c.title, code: c.code, level: c.level, totalMinutes: c.totalMinutes }
        : null,
    };
  });
};

const payEnrollment = async (userId, id) => {
  const enrollment = await prisma.enrollment.findUnique({ where: { id } });
  if (!enrollment) throw new HttpError(404, "Matrícula no encontrada");
  if (enrollment.userId !== userId) throw new HttpError(403, "La matrícula no es suya");
  return prisma.enrollment.update({ where: { id }, data: { paymentStatus: "PAID" } });
};

// Borrar la matrícula también borra su comentario en MongoDB
const deleteEnrollment = async (userId, id) => {
  const enrollment = await prisma.enrollment.findUnique({ where: { id } });
  if (!enrollment) throw new HttpError(404, "Matrícula no encontrada");
  if (enrollment.userId !== userId) throw new HttpError(403, "La matrícula no es suya");
  await Comment.deleteMany({ enrollmentId: id });
  await prisma.enrollment.delete({ where: { id } });
  return enrollment;
};

module.exports = { createEnrollment, listMyEnrollments, payEnrollment, deleteEnrollment };
