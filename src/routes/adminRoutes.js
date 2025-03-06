const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { autheticateUser } = require("../middlewares/authMiddleware");

//  check if user is authenticated and admin

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Access denied, not authorized / Admins Only" });
  }
  next();
};

// 📜 View All Tickets (Admin only)

router.get("/all-tickets", autheticateUser, isAdmin, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany();
    res.json({ message: "Tickets fetched successfully", tickets });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Request not completed" });
    } else {
      res
        .status(500)
        .json({ message: "Error fetching tickets", error: error.message });
    }
  }
});

// ✅ Update Ticket Status (Admin only)

router.put(
  "/update-status/:id",
  autheticateUser,
  isAdmin,
  async (req, res) => {
    const { ticketId } = parseInt(req.params.id);
    const { status } = req.body;

    if (!["Open", "Resolved", "Closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status },
      });

      res.json({ message: "Ticket status updated successfully" });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({ message: "Request not completed" });
      } else {
        res.status(500).json({
          message: "Error updating ticket status",
          error: error.message,
        });
      }
    }
  }
);

module.exports = router;
