// GET /api/users/profile
const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { getProfile };
