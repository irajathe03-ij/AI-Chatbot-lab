
const User = require("../models/User");

// Get logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully!",
      user,
    });
  } catch (error) {
    console.error("Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile.",
    });
  }
};

module.exports = { getProfile };
