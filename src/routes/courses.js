const { Router } = require("express");
const c = require("../controllers/courseController");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.get("/", c.list);
router.get("/:id/comments", c.listComments);
router.get("/:id", c.getById);
router.post("/", authenticateToken, c.create);
router.put("/:id", authenticateToken, c.update);
router.delete("/:id", authenticateToken, c.remove);

module.exports = router;
