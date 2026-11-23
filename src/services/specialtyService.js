
const Specialty = require("../models/specialty");

const createSpecialtyService = async (data) => {
    return Specialty.create(data);
};


const getSpecialtiesService = async ({ q, area, fields }) => {
    const filter = {};

    if (q) {
        const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        filter.$or = [
            { name: { $regex: escapedQuery, $options: "i" } },
            { code: { $regex: escapedQuery, $options: "i" } },
            { description: { $regex: escapedQuery, $options: "i" } }
        ];
    }

    if (area) {
        filter.area = area;
    }

    let query = Specialty.find(filter);

    if (fields) {
        query = query.select(fields.split(",").join(" "));
    }

    return query;
};

// READ - Consultar por ID
const getSpecialtyByIdService = async (id) => {
    return Specialty.findById(id);
};

// UPDATE - Actualizar especialidad
const updateSpecialtyService = async (id, data) => {
    const specialty = await Specialty.findById(id);

    if (!specialty) return null;

    Object.assign(specialty, data);

    return specialty.save();
};

// PATCH - Actualizar duración
const updateDurationService = async (id, durationMinutes) => {
    const specialty = await Specialty.findById(id);

    if (!specialty) return null;

    specialty.durationMinutes = durationMinutes;

    return specialty.save();
};

// PATCH - Cambiar área de las especialidades
const updateAreaService = async (currentArea, newArea) => {
    return Specialty.updateMany(
        { area: currentArea },
        { $set: { area: newArea } },
        { runValidators: true }
    );
};

// DELETE - Eliminar por ID
const deleteSpecialtyService = async (id) => {
    return Specialty.findByIdAndDelete(id);
};

// DELETE - Eliminar por área
const deleteAreaService = async (area) => {
    return Specialty.deleteMany({ area });
};

module.exports = {
    createSpecialtyService,
    getSpecialtiesService,
    getSpecialtyByIdService,
    updateSpecialtyService,
    updateDurationService,
    updateAreaService,
    deleteSpecialtyService,
    deleteAreaService
};
