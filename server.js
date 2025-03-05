const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const authRoute = require("./src/routes/authRoutes");

dotenv.config();

// routes


const app = express();


// Middleware

app.use(cors());
app.use(express.json());




// Routes


app.use("/api/auth", authRoute)



app.get('/', (req, res) => {
    res.send('Welcome to Complaint Management Service');
});


// Start server

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
