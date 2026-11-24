const mongoose = require("mongoose");
const slugify = require("slugify");

// Módulo embebido: se lee siempre junto con el curso y pertenece solo a ese curso.
const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título del módulo es obligatorio"],
    trim: true,
    minlength: [3, "El título del módulo debe tener mínimo 3 caracteres"],
  },
  durationMinutes: {
    type: Number,
    required: [true, "La duración del módulo es obligatoria"],
    min: [5, "Un módulo dura al menos 5 minutos"],
    max: [600, "Un módulo dura como máximo 600 minutos"],
  },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título del curso es obligatorio"],
    trim: true,
    minlength: [5, "El título debe tener mínimo 5 caracteres"],
    maxlength: [100, "El título no puede superar 100 caracteres"],
  },
  code: {
    type: String,
    required: [true, "El código es obligatorio"],
    unique: true,
    match: [/^[A-Z]{3}-\d{3}$/, "El código debe tener el formato ABC-123"],
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    minlength: [20, "La descripción debe tener mínimo 20 caracteres"],
    maxlength: [500, "La descripción no puede superar 500 caracteres"],
  },
  level: {
    type: String,
    enum: {
      values: ["basico", "intermedio", "avanzado"],
      message: "El nivel {VALUE} no es válido (use basico, intermedio o avanzado)",
    },
    default: "basico",
  },
  price: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: [0, "El precio no puede ser negativo"],
    max: [2000, "El precio no puede superar 2000"],
  },
  modules: {
    type: [moduleSchema],
    // Validación propia: al menos un módulo y sin títulos repetidos.
    validate: {
      validator: (mods) => {
        if (!Array.isArray(mods) || mods.length === 0) return false;
        const titles = mods.map((m) => (m.title || "").trim().toLowerCase());
        return new Set(titles).size === titles.length;
      },
      message: "El curso necesita al menos un módulo y los títulos no pueden repetirse",
    },
  },
  slug: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Índice para la búsqueda por nivel y orden por título.
courseSchema.index({ level: 1, title: 1 });

// Virtual: duración total del curso, calculada con los módulos.
courseSchema.virtual("totalMinutes").get(function () {
  return (this.modules || []).reduce((sum, m) => sum + (m.durationMinutes || 0), 0);
});

courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

// Middleware: genera el slug antes de validar (sin next: Mongoose 9 usa funciones sin callback).
courseSchema.pre("validate", function () {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

module.exports = mongoose.model("Course", courseSchema);
