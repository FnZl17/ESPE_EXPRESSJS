const reservationService = require("../services/reservationService");

async function authorizeReservation(req, res, next) {
  try {
    const reservation = await reservationService.getReservation(req.params.id);
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" });
    const isOwner = reservation.userId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ error: "Access Denied" });
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = authorizeReservation;