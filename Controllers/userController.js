const User = require("../Models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: "1h" });

    // Set JWT token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // Make it accessible only by HTTP requests
      secure: process.env.NODE_ENV, // Ensure the cookie is secure in production
      maxAge: 3600000, // 1 hour expiration
      sameSite: 'Strict', // Optional, prevent cross-site request forgery
    });

    return res.status(200).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login (set token in cookie)
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, secret,{expiresIn: "1hr"});

    const decodedToken = jwt.decode(token);
    console.log(decodedToken)
    
    // Set JWT token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,  // Make it accessible only by HTTP requests
      secure: process.env.NODE_ENV === 'production',  // Ensure the cookie is secure in production
      maxAge: 3600000,  // Convert 1 hour into milliseconds for cookie expiration
      sameSite: 'Strict',  // Optional, prevent cross-site request forgery
      domain: 'localhost',
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User found successfully",
      user: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.userLogout = async (req, res) => {
  try {

    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: 'Strict',
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};
