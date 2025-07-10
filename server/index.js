const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./models/User.js");
const Robot = require("./models/Robot.js");
const Order = require("./models/Order.js");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET || "your-jwt-secret-here";

app.use(express.json());
app.use(cookieParser());

// Session middleware for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.profilePicture = profile.photos[0]?.value;
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      profilePicture: profile.photos[0]?.value,
      authProvider: 'google'
    });
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

// Helper function to generate JWT token
function generateJWTToken(user) {
  return jwt.sign(
    {
      email: user.email,
      id: user._id,
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
}

app.get("/api/test", (req, res) => {
  res.json("test ok");
});

// Traditional registration
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      authProvider: 'local'
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = userDoc.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (e) {
    res.status(422).json({ error: e.message });
  }
});

// Traditional login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user registered with OAuth
    if (userDoc.authProvider === 'google' && !userDoc.password) {
      return res.status(400).json({ 
        error: "Please sign in with Google", 
        useOAuth: true 
      });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      const token = generateJWTToken(userDoc);
      const { password: _, ...userWithoutPassword } = userDoc.toObject();
      res.cookie("token", token, getCookieOptions()).json(userWithoutPassword);
    } else {
      res.status(422).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Google OAuth routes
app.get("/auth/google", 
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login?error=oauth_failed" }),
  async (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = generateJWTToken(req.user);
      
      // Set the JWT token as a cookie
      res.cookie("token", token, getCookieOptions());
      
      // Redirect to frontend success page
      const redirectUrl = isProduction 
        ? "https://robot-ecommerce.vercel.app/?oauth=success"
        : "http://localhost:5173/?oauth=success";
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("OAuth callback error:", error);
      const redirectUrl = isProduction 
        ? "https://robot-ecommerce.vercel.app/login?error=oauth_failed"
        : "http://localhost:5173/login?error=oauth_failed";
      res.redirect(redirectUrl);
    }
  }
);

// Get current user (works with both JWT and session)
app.get("/api/profile", async (req, res) => {
  try {
    let user = null;
    
    // Try JWT token first
    const { token } = req.cookies;
    if (token) {
      try {
        const userData = await getUserDataFromReq(req);
        user = await User.findById(userData.id);
      } catch (err) {
        // JWT invalid, try session
        if (req.user) {
          user = req.user;
        }
      }
    } else if (req.user) {
      // No JWT token, but session exists
      user = req.user;
    }
    
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/logout", (req, res) => {
  // Clear JWT token
  res.cookie("token", "", getCookieOptions());
  
  // Logout from session
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.json({ success: true });
  });
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
    
    // Try to get user from JWT token
    const { token } = req.cookies;
    if (token) {
      try {
        const userData = await getUserDataFromReq(req);
        userId = userData.id;
      } catch (err) {
        // JWT invalid, try session
        if (req.user) {
          userId = req.user._id;
        }
      }
    } else if (req.user) {
      userId = req.user._id;
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
    let userId = null;
    
    // Try to get user from JWT token
    const { token } = req.cookies;
    if (token) {
      try {
        const userData = await getUserDataFromReq(req);
        userId = userData.id;
      } catch (err) {
        // JWT invalid, try session
        if (req.user) {
          userId = req.user._id;
        }
      }
    } else if (req.user) {
      userId = req.user._id;
    }

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const orders = await Order.find({ userId }).sort({
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