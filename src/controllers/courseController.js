const service = require("../services/courseService");
const commentService = require("../services/commentService");
const { handleError } = require("../utils/httpError");

const create = async (req, res) => {
  try {
    return res.status(201).json(await service.createCourse(req.body));
  } catch (e) { return handleError(res, e); }
};

const list = async (req, res) => {
  try {
    const data = await service.listCourses(req.query);
    return res.status(200).json({ total: data.length, data });
  } catch (e) { return handleError(res, e); }
};

const getById = async (req, res) => {
  try {
    return res.status(200).json(await service.getCourse(req.params.id));
  } catch (e) { return handleError(res, e); }
};

const update = async (req, res) => {
  try {
    return res.status(200).json(await service.updateCourse(req.params.id, req.body));
  } catch (e) { return handleError(res, e); }
};

const remove = async (req, res) => {
  try {
    const { course, deletedComments } = await service.deleteCourse(req.params.id);
    return res.status(200).json({ message: "Curso eliminado", id: course._id, deletedComments });
  } catch (e) { return handleError(res, e); }
};

const listComments = async (req, res) => {
  try {
    return res.status(200).json(await commentService.listCourseComments(req.params.id));
  } catch (e) { return handleError(res, e); }
};

module.exports = { create, list, getById, update, remove, listComments };
