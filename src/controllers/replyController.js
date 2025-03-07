const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addReply = async (req, res) => {
  const ticketId = parseInt(req.params.ticketId, 10);
  const { message } = req.body;

  if (!message) {
    return res.status(404).json({ message: "Reply message can not be empty" });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const reply = await prisma.reply.create({
      data: {
        message,
        ticketId,
        userId: req.user.userId,
      },
    });

    res.status(201).json({ message: "Repply added successfully", reply });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding reply", error: error.message });
  }
};

// 📨 Get Replies for a Ticket

exports.getRepliesByTicket = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const replies = await prisma.reply.findMany({
      where: { ticketId: parseInt(ticketId) },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({ message: "Replies fetched successfully", replies });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching replies", error: error.message });
  }
};
