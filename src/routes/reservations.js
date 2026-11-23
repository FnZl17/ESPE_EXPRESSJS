const { Router } = require("express");
const reservationController = require("../controllers/reservationController");
const authenticateToken = require("../middlewares/auth");
const authorizeReservation = require("../middlewares/authorizeReservation");
const router = Router();

router.post("/", authenticateToken, reservationController.createReservation);
router.get(
  "/:id",
  authenticateToken,
  authorizeReservation,
  reservationController.getReservation,
);
router.put(
  "/:id",
  authenticateToken,
  authorizeReservation,
  reservationController.updateReservation,
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeReservation,
  reservationController.deleteReservation,
);

module.exports = router;