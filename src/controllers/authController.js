const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// =============== User SingUp =================

exports.singup = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // check if user is already existing
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User / Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    });


    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Request not completed" });
    } else {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
    next(error);
  }
};

// ================== user login ==========================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // password check

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // generate JWT token

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Request not completed" });
    } else {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  }
};
