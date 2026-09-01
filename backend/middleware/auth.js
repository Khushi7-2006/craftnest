const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Blocks access unless the request carries a valid JWT (set as an httpOnly cookie at login).
// Works for both customers (looked up in MongoDB) and the fixed seller account.
const requireAuth = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "seller") {
      req.user = { id: "seller", role: "seller" };
      return next();
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Please log in to continue." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Please log in to continue." });
  }
};

// Blocks access unless the logged-in account is the seller.
// Must run after requireAuth.
const requireSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Seller access only." });
  }
  next();
};

module.exports = { requireAuth, requireSeller };
