const { Router } = require("express");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const reservations = require("./reservations");
const specialtyRouter = require("./specialties");
const appointments = require("./appointments");
const courses = require("./courses");
const enrollments = require("./enrollments");
const comments = require("./comments");

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/appointments", appointments);
router.use("/reservations", reservations);
router.use("/specialties", specialtyRouter);
router.use("/courses", courses);
router.use("/enrollments", enrollments);
router.use("/comments", comments);

module.exports = router;