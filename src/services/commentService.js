const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Course = require("../models/course");
const prisma = require("../db/prisma");
const { HttpError } = require("../utils/httpError");

// Crear en MongoDB validando PostgreSQL: la matrícula debe existir (404) y ser del usuario del JWT (403).
const createComment = async (userId, { enrollmentId, rating, text }) => {
  const id = Number(enrollmentId);
  if (!Number.isInteger(id)) throw new HttpError(400, "enrollmentId debe ser un número entero");

  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
  if (!enrollment) throw new HttpError(404, "Matrícula no encontrada");
  if (enrollment.userId !== userId) throw new HttpError(403, "La matrícula no es suya");
  if (enrollment.paymentStatus !== "PAID") throw new HttpError(403, "Solo puede comentar si la matrícula está pagada");

  return Comment.create({
    enrollmentId: id,
    userId, // sale del JWT, nunca del body
    courseId: enrollment.courseId,
    studentName: enrollment.user.name, // dato copiado de PostgreSQL
    rating,
    text,
  });
};


const listCourseComments = async (courseId) => {
  if (!mongoose.isValidObjectId(courseId)) throw new HttpError(400, "El id del curso no es válido");
  if (!(await Course.exists({ _id: courseId }))) throw new HttpError(404, "Curso no encontrado");

  const [comments, stats] = await Promise.all([
    Comment.find({ courseId }).populate("courseId", "title code level").sort({ createdAt: -1 }),
    Comment.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: "$courseId", average: { $avg: "$rating" }, total: { $sum: 1 } } },
    ]),
  ]);

  const summary = stats[0]
    ? { average: Math.round(stats[0].average * 100) / 100, total: stats[0].total }
    : { average: null, total: 0 };
  return { summary, data: comments };
};

module.exports = { createComment, listCourseComments };
