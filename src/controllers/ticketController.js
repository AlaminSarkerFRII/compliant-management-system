const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🎟️ Create a Ticket
exports.createNewTicket = async (req, res) => {
  const { subject, description } = req.body;

  if (!subject || !description) {
    return res
      .status(400)
      .json({ message: "Subject and description are required" });
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        customerId: req.user.userId,
      },
    });

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating ticket", error: error.message });
  }
};

// 👀 View Customer's Tickets
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { customerId: req.user.userId },
    });
    res.json({ message: "Tickets fetched successfully", tickets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tickets", error: error.message });
  }
};

// ❌ Delete Ticket (Customer only)
exports.deleteTicket = async (req, res) => {
  const ticketId = parseInt(req.params.id);

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

    if (!ticket || ticket.customerId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this ticket" });
    }

    await prisma.ticket.delete({ where: { id: ticketId } });
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting ticket", error: error.message });
  }
};


