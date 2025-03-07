const express = require("express");
const {
  addReply,
  getRepliesByTicket,
} = require("../controllers/replyController");

const router = express.Router();

router.post("/:ticketId/reply", addReply);
router.get("/:ticketId/replies", getRepliesByTicket);

module.exports = router;
