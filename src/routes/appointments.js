const { Router } = require("express");
const appointmentController = require("../controllers/appointmentController");
const authenticateToken = require("../middlewares/auth");
const authorizeUser = require("../middlewares/authorizeUser");
const router = Router();

router.get(
  "/:id/appointments",
  authenticateToken,
  authorizeUser,
  appointmentController.getUserAppointments,
);

module.exports = router;