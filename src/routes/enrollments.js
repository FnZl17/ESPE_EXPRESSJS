const { Router } = require("express");
const c = require("../controllers/enrollmentController");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.use(authenticateToken);
router.post("/", c.create);
router.get("/me", c.listMine);
router.patch("/:id/pay", c.pay);
router.delete("/:id", c.remove);

module.exports = router;
