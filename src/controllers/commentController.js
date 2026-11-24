const service = require("../services/commentService");
const { handleError } = require("../utils/httpError");

const create = async (req, res) => {
  try {
    return res.status(201).json(await service.createComment(req.user.id, req.body));
  } catch (e) { return handleError(res, e); }
};

module.exports = { create };
