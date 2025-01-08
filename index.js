const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const PORT = 5000;
require("dotenv").config();
require('./Database/config');
const Routes = require('./Routes/Router');

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: 'https://task-management-system-fe.vercel.app', // Replace with your frontend URL
    credentials: true,
}));

app.use(express.json());
app.use(Routes);

// Simple route for basic server test
app.get('/', (req, res) => {
    res.status(200).json("Server is running")
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
