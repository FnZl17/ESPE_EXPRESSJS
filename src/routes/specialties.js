const {Router} = require("express");
const specialtyController = require("../controllers/specialtyController");
const router = Router();

router.post("/", specialtyController.createSpecialty);
router.get("/", specialtyController.getSpecialties);    
router.get("/:id", specialtyController.getSpecialtyById);
router.put("/:id", specialtyController.updateSpecialty);
router.patch("/:id/duration", specialtyController.updateDuration);
router.patch("/area/:area", specialtyController.updateArea);
router.delete("/:id", specialtyController.deleteSpecialty);
router.delete("/area/:area", specialtyController.deleteArea);

module.exports = router;