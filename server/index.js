const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const Robot = require("./models/Robot.js");
const Order = require("./models/Order.js");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

app.use(express.json());
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === "production";

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
});

app.use(
  cors({
    credentials: true,
    origin: [
      "https://robot-ecommerce.vercel.app",
      "http://localhost:5173",
      "https://robot-ecommerce-1.onrender.com",
    ],
  }),
);

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error("MONGO_URI environment variable is not defined");
}
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get("/api/test", (req, res) => {
  res.json("test ok");
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.status(201).json(userDoc);
  } catch (e) {
    res.status(422).json({ error: e.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token, getCookieOptions()).json(userDoc);
        },
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

app.post("/api/logout", (req, res) => {
  res.cookie("token", "", getCookieOptions()).json(true);
});

app.get("/api/robots", async (req, res) => {
  try {
    const robots = await Robot.find();
    res.json(robots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching robots" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { items, customerInfo, paymentMethod, paymentStatus, totalAmount } =
      req.body;

    let userId = null;
    const { token } = req.cookies;
    if (token) {
      const userData = await getUserDataFromReq(req);
      userId = userData.id;
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderDoc = await Order.create({
      items,
      customerInfo,
      paymentMethod,
      paymentStatus,
      totalAmount,
      userId,
      orderStatus: "processing",
    });

    res.status(201).json({ success: true, order: orderDoc });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userData = await getUserDataFromReq(req);
    const orders = await Order.find({ userId: userData.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});