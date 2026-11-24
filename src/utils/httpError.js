// Error con código HTTP para que los servicios lo lancen y el controlador lo traduzca.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Traduce errores de Mongoose, Mongo (E11000), Prisma (P2002) y HttpError a una respuesta.
const handleError = (res, error) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Datos inválidos",
      errors: Object.values(error.errors).map((e) => e.message),
    });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ error: `Valor inválido para ${error.path}` });
  }
  if (error.code === 11000 || error.code === "P2002") {
    return res.status(409).json({ error: "Ya existe un registro con ese valor" });
  }
  console.error(error);
  return res.status(500).json({ error: "Error en el servidor" });
};

module.exports = { HttpError, handleError };
