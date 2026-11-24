const { Router } = require("express");
const c = require("../controllers/commentController");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.post("/", authenticateToken, c.create);

module.exports = router;
