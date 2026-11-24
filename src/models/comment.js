const mongoose = require("mongoose");

// Registro que crece sin límite: un comentario por matrícula.
// enrollmentId y userId apuntan a PostgreSQL (Number, sin FK); courseId usa ref de Mongoose.
const commentSchema = new mongoose.Schema({
  enrollmentId: {
    type: Number,
    required: [true, "La matrícula es obligatoria"],
    unique: true, // una matrícula = un comentario -> E11000 -> 409
  },
  userId: {
    type: Number,
    required: [true, "El usuario es obligatorio"],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "El curso es obligatorio"],
    index: true,
  },
  // Dato copiado de PostgreSQL (User.name) para mostrar comentarios sin consultar PostgreSQL.
  studentName: {
    type: String,
    required: [true, "El nombre del estudiante es obligatorio"],
  },
  rating: {
    type: Number,
    required: [true, "La calificación es obligatoria"],
    min: [1, "La calificación mínima es 1"],
    max: [5, "La calificación máxima es 5"],
  },
  text: {
    type: String,
    required: [true, "El comentario es obligatorio"],
    trim: true,
    minlength: [5, "El comentario debe tener mínimo 5 caracteres"],
    maxlength: [500, "El comentario no puede superar 500 caracteres"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
