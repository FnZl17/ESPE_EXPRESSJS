const mongoose = require("mongoose");
const Course = require("../models/course");
const Comment = require("../models/comment");
const prisma = require("../db/prisma");
const { HttpError } = require("../utils/httpError");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const ensureValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "El id del curso no es válido");
};

const createCourse = (data) => Course.create(data);

// GET ?q= (regex) &fields= (proyección) &sort= (orden) &level=
const listCourses = async ({ q, fields, sort, level }) => {
  const filter = {};
  if (q) {
    const rx = { $regex: escapeRegex(q), $options: "i" };
    filter.$or = [{ title: rx }, { code: rx }, { description: rx }];
  }
  if (level) filter.level = level;

  let query = Course.find(filter);
  if (fields) query = query.select(fields.split(",").join(" "));
  // sort=price | sort=-price | sort=title,-price
  query = query.sort(sort ? sort.split(",").join(" ") : "title");
  return query;
};

const getCourse = async (id) => {
  ensureValidId(id);
  const course = await Course.findById(id);
  if (!course) throw new HttpError(404, "Curso no encontrado");
  return course;
};

// PUT: findById + save() para que corran las validaciones y el pre("validate").
const updateCourse = async (id, data) => {
  const course = await getCourse(id);
  delete data._id;
  Object.assign(course, data);
  return course.save();
};

// Borrado protegido: 409 si PostgreSQL tiene matrículas; si no, cascada sobre los comentarios.
const deleteCourse = async (id) => {
  const course = await getCourse(id);
  const enrollments = await prisma.enrollment.count({ where: { courseId: String(course._id) } });
  if (enrollments > 0) {
    throw new HttpError(409, `No se puede borrar: el curso tiene ${enrollments} matrícula(s) en PostgreSQL`);
  }
  const { deletedCount } = await Comment.deleteMany({ courseId: course._id });
  await course.deleteOne();
  return { course, deletedComments: deletedCount };
};

module.exports = { createCourse, listCourses, getCourse, updateCourse, deleteCourse };
