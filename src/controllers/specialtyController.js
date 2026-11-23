
const {
    createSpecialtyService,
    //listSpecialtiesService,
    getSpecialtiesService,
    getSpecialtyByIdService,
    updateSpecialtyService,
    updateDurationService,
    updateAreaService,
    deleteSpecialtyService,
    deleteAreaService
} = require("../services/specialtyService");

const handleError = (res, error) => {
    console.error("ERROR AL CREAR ESPECIALIDAD:", error);

    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
            error: "Datos inválidos",
            errors
        });
    }

    if (error.name === "CastError") {
        return res.status(400).json({
            error: `Valor inválido para ${error.path}: ${error.value}`
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({
            error: "Ya existe un registro con ese valor"
        });
    }

    return res.status(500).json({
        error: "Error en el servidor",
        detail: error.message
    });
};

const createSpecialty = async (req, res) => {
    try {
        const specialty = await createSpecialtyService(req.body);

        return res.status(201).json(specialty);
    } catch (error) {
        return handleError(res, error);
    }
};

/*const listSpecialties = async (req, res) => {
    try{
        const specialty = await listSpecialties(req.body);
        res.json(specialty);
    }catch(error){
        handleError(res, error);
    }
}*/

const getSpecialties = async (req, res) => {
    try {
        const { q, area, fields } = req.query;

        const specialties = await getSpecialtiesService({
            q,
            area,
            fields
        });

        return res.status(200).json({
            total: specialties.length,
            data: specialties
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// READ - POR ID
const getSpecialtyById = async (req, res) => {
    try {
        const specialty = await getSpecialtyByIdService(req.params.id);

        if (!specialty) {
            return res.status(404).json({
                error: "Especialidad no encontrada"
            });
        }

        return res.status(200).json(specialty);
    } catch (error) {
        return handleError(res, error);
    }
};

// UPDATE
const updateSpecialty = async (req, res) => {
    try {
        const specialty = await updateSpecialtyService(
            req.params.id,
            req.body
        );

        if (!specialty) {
            return res.status(404).json({
                error: "Especialidad no encontrada"
            });
        }

        return res.status(200).json(specialty);
    } catch (error) {
        return handleError(res, error);
    }
};

// PATCH - DURACIÓN
const updateDuration = async (req, res) => {
    try {
        const specialty = await updateDurationService(
            req.params.id,
            req.body.durationMinutes
        );

        if (!specialty) {
            return res.status(404).json({
                error: "Especialidad no encontrada"
            });
        }

        return res.status(200).json(specialty);
    } catch (error) {
        return handleError(res, error);
    }
};

// PATCH - ÁREA
const updateArea = async (req, res) => {
    try {
        const result = await updateAreaService(
            req.params.area,
            req.body.area
        );

        return res.status(200).json({
            message: "Área actualizada correctamente",
            matched: result.matchedCount,
            modified: result.modifiedCount
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// DELETE - POR ID
const deleteSpecialty = async (req, res) => {
    try {
        const specialty = await deleteSpecialtyService(req.params.id);

        if (!specialty) {
            return res.status(404).json({
                error: "Especialidad no encontrada"
            });
        }

        return res.status(200).json({
            message: "Especialidad eliminada correctamente",
            data: specialty
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// DELETE - POR ÁREA
const deleteArea = async (req, res) => {
    try {
        const result = await deleteAreaService(req.params.area);

        return res.status(200).json({
            message: "Eliminación por área completada",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        return handleError(res, error);
    }
};

module.exports = {
    createSpecialty,
    getSpecialties,
    getSpecialtyById,
    updateSpecialty,
    updateDuration,
    updateArea,
    deleteSpecialty,
    deleteArea
};
