// GET /api/users/profile
const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  getProfile,
  getAllCustomers,
};
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
