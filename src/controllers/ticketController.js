const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//=====================> Create a Ticket ==================>

exports.createNewTicket = async (req, res) => {
  const { subject, description } = req.body;

  if (!subject || !description) {
    return res
      .status(400)
      .json({ message: "Subject and description are required" });
  }

  try {
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      return res
        .status(404)
        .json({ message: "No admin found, unable to assign ticket" });
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        customerId: req.user.userId,
        assignedToId: admin.id,
      },
      include: {
        assignedTo: {
          select: { role: true },
        },
      },
    });

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating ticket", error: error.message });
  }
};

//================> View Customer's Tickets ============================>

exports.getMyTickets = async (req, res) => {
  const { status, subject, assignedToId } = req.query;

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        // customerId: req.user.userId
        ...(status && { status }),
        ...(subject && { subject: { contains: subject } }),
        ...(assignedToId && { assignedToId: parseInt(assignedToId, 10) }),
      },
      include: {
        customer: {
          select: { id: true, name: true },
        },
        assignedTo: {
          select: { id: true, name: true, role: true },
        },
      },
    });
    res.json({ message: "Tickets fetched successfully", tickets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tickets", error: error.message });
  }
};

// ============== get All Tickets ===================>

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        customer: {
          select: { id: true, name: true },
        },
        assignedTo: {
          select: { id: true, name: true, role: true },
        },
        replaies: {
          select: {
            id: true,
            message: true,
            userId: true,
            createdAt: true,
          },
        },
      },
    });
    res.json({ message: "Tickets fetched successfully", tickets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tickets", error: error.message });
  }
};

// =================> update tickets =================>

exports.updateTicketStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const validationStatus = ["OPEN", "IN_PROGRESS", "CLOSED", "RESOLVED"];
  if (!validationStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status === status) {
      return res
        .status(400)
        .json({ message: "Ticket status is already set to this value" });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json({
      message: "Ticket status updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating ticket status", error: error.message });
  }
};

//==============>  Delete Ticket (Customer only) ======================>

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
