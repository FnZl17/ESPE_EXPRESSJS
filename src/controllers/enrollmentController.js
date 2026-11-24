const service = require("../services/enrollmentService");
const { handleError, HttpError } = require("../utils/httpError");

const parseId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id)) throw new HttpError(400, "El id debe ser un número entero");
  return id;
};

const create = async (req, res) => {
  try {
    return res.status(201).json(await service.createEnrollment(req.user.id, req.body));
  } catch (e) { return handleError(res, e); }
};

const listMine = async (req, res) => {
  try {
    const data = await service.listMyEnrollments(req.user.id);
    return res.status(200).json({ total: data.length, data });
  } catch (e) { return handleError(res, e); }
};

const pay = async (req, res) => {
  try {
    return res.status(200).json(await service.payEnrollment(req.user.id, parseId(req.params.id)));
  } catch (e) { return handleError(res, e); }
};

const remove = async (req, res) => {
  try {
    await service.deleteEnrollment(req.user.id, parseId(req.params.id));
    return res.status(200).json({ message: "Matrícula eliminada" });
  } catch (e) { return handleError(res, e); }
};

module.exports = { create, listMine, pay, remove };
