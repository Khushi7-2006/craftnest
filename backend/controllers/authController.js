const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const SellerSettings = require("../models/SellerSettings");

// Simple JWT-in-httpOnly-cookie auth
const COOKIE_NAME = "token";
const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const PHONE_REGEX = /^\+\d{1,3}\d{10}$/;

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const {
      phone,
      password,
      confirmPassword,
      name,
      address,
    } = req.body;

    if (!phone || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Phone, password and confirm password are required.",
      });
    }

    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({
        message: "Enter a valid 10-digit phone number with country code.",
      });
    }

    if (!name || !address) {
      return res.status(400).json({
        message: "Name and address are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(409).json({
        message: "Phone number is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      address,
      password: hashedPassword,
    });

    const token = signToken({
      id: user._id.toString(),
      role: "buyer",
    });

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(201).json({
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone number and password are required.",
      });
    }

    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({
        message: "Enter a valid 10-digit phone number with country code.",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({
        message: "Invalid phone number or password.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid phone number or password.",
      });
    }

    const token = signToken({
      id: user._id.toString(),
      role: "buyer",
    });

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(200).json({
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/seller/login
const sellerLogin = async (req, res) => {
  try {
    const { sellerId, password } = req.body;

    if (!sellerId || !password) {
      return res.status(400).json({
        message: "Seller ID and password are required.",
      });
    }

    // Check MongoDB first.
    // If Seller ID has never been changed, use Render environment variable.
    const settings = await SellerSettings.findOne();

    const currentSellerId =
      settings?.sellerId || process.env.SELLER_ID;

    if (
      sellerId === currentSellerId &&
      password === process.env.SELLER_PASSWORD
    ) {
      const token = signToken({
        id: "seller",
        role: "seller",
      });

      res.cookie(COOKIE_NAME, token, cookieOptions);

      return res.status(200).json({
        user: {
          id: "seller",
          phone: null,
          role: "seller",
        },
      });
    }

    res.status(401).json({
      message: "Invalid seller ID or password.",
    });
  } catch (error) {
    console.error("Seller login error:", error);

    res.status(500).json({
      message: "Server error during seller login.",
    });
  }
};

// GET /api/auth/current-user
const getCurrentUser = async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(200).json({
      user: null,
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role === "seller") {
      return res.status(200).json({
        user: {
          id: "seller",
          phone: null,
          role: "seller",
        },
      });
    }

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(200).json({
        user: null,
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch {
    res.status(200).json({
      user: null,
    });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  res.status(200).json({
    message: "Logged out successfully.",
  });
};

// GET /api/auth/seller/settings
const getSellerSettings = async (req, res, next) => {
  try {
    const settings = await SellerSettings.findOne();

    const sellerId =
      settings?.sellerId || process.env.SELLER_ID;

    res.status(200).json({
      sellerId,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/seller/settings
const updateSellerSettings = async (req, res, next) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId || !sellerId.trim()) {
      return res.status(400).json({
        message: "Seller ID is required.",
      });
    }

    const newSellerId = sellerId.trim();

    let settings = await SellerSettings.findOne();

    if (settings) {
      settings.sellerId = newSellerId;
      await settings.save();
    } else {
      settings = await SellerSettings.create({
        sellerId: newSellerId,
      });
    }

    res.status(200).json({
      message: "Seller ID updated successfully.",
      sellerId: settings.sellerId,
    });
  } catch (error) {
    next(error);
  }
};

// Export all functions
module.exports = {
  register,
  login,
  sellerLogin,
  getCurrentUser,
  logout,
  getSellerSettings,
  updateSellerSettings,
};
