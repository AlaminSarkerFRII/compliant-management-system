const express = require("express");
const router = express.Router();


const {
  createNewTicket,
  getMyTickets,
  deleteTicket,
} = require("../controllers/ticketController");

router.post("/create", createNewTicket);
router.get("/my-tickets", getMyTickets);
router.delete("/:id", deleteTicket);

module.exports = router;
