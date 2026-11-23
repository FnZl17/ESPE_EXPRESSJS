
const mongoose = require("mongoose");
const slugify = require("slugify");
const { isEmail } = require("validator");

const specialtySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    validate: {
      validator: async function (value) {
        const existing = await mongoose.models.Specialty.findOne({
          name: value,
        });
        return !existing || existing._id.equals(this._id); // al actualizar, no choca consigo mismo
      },
      message: (props) => `La especialidad "${props.value}" ya existe`,
    },
  },
  code: {
    type: String,
    required: [true, "El código es obligatorio"],
    match: [/^[A-Z]{3}-\d{2}$/, "El código debe tener el formato ABC-01"],
  },

  description: {
    type: String,
    required: true,
    minlength: [50, "La descripción debe tener mínimo 50 caracteres"],
    maxlength: [300, "La descripción no puede superar 300 caracteres"],
  },

  area: {
    type: String,
    enum: {
      values: ["clinica", "quirurgica", "diagnostico"],
      message: "El área {VALUE} no es válida",
    },
    default: "clinica",
  },

  durationMinutes: {
    type: Number,
    default: 30,
    min: [15, "La consulta dura al menos 15 minutos"],
    max: [120, "La consulta dura como máximo 120 minutos"],
    validate: {
      validator: (value) => value % 15 === 0,
      message: "La duración debe ser múltiplo de 15",
    },
  },

  contactEmail: {
    type: String,
    validate: {
      validator: (value) => !value || isEmail(value),
      message: "El correo de contacto no es válido",
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  slug: {
    type: String,
    required: true,
  },
});

specialtySchema.virtual("Info").get(function () {
  return `${this.name} (${this.code}): consulta de ${this.durationMinutes} minutos`;
});

specialtySchema.virtual("label").set(function (value) {
  const [prefix, number, ...nameParts] = value.split("-");
  this.code = `${prefix}-${number}`;
  this.name = nameParts.join("-").trim();
});

specialtySchema.pre("validate", function () {
  if (this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});

module.exports = mongoose.model("Specialty", specialtySchema);
