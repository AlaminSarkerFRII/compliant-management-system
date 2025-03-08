const express = require("express");
const router = express.Router();
const {
  autheticateUser,
  authorizedAdmin,
} = require("../middlewares/authMiddleware");

const {
  createNewTicket,
  getMyTickets,
  deleteTicket,
  updateTicketStatus,
  getAllTickets,
} = require("../controllers/ticketController");

router.post("/create", createNewTicket);

router.patch(
  "/:id/status",
  autheticateUser,
  authorizedAdmin,
  updateTicketStatus
);

router.get("/all", autheticateUser, authorizedAdmin, getAllTickets);

router.get("/my-tickets", getMyTickets);
router.delete("/:id", deleteTicket);

module.exports = router;
