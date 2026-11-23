const{
    createTimeBlockService,
    listReservationsService
} = require("../services/adminService");

const createTimeBlock = async (req,res) =>{
    if(req.user.rol !== "ADMIN"){
        return res.status(403).json({error: "access denied"});
    }
    const {starTime, endTime} = req.body;
    try {
        const newTimeBlock = await createTimeBlockService(starTime, endTime);
        res.status(201).json(newTimeBlock);
    } catch (error) {
        res.status(500).json({error: "Error al crear time block"});
    }
}

const listReservations = async (req, res) => {
  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const reservations = await listReservationsService();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reservations" });
  }
};
 
module.exports = { createTimeBlock, listReservations };