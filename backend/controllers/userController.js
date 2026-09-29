const User = require("../models/User");

// GET /api/users/profile
const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// GET /api/users/customers
const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find(
      { role: "buyer" },
      "-password"
    ).sort({ createdAt: -1 });

    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getAllCustomers,
};
