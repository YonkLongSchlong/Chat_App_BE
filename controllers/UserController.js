import bcryptjs from "bcryptjs";
import User from "../models/User.js";

/* ---------- UPDATE UERNAME ---------- */
const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    /* Tìm user tồn tại trong DB */
    const user = await User.findById({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    /* Đổi username và lưu vào DB */
    user.username = username;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ Error: "Update username failed", msg: error.message });
  }
};

/* ---------- UPDATE BIO ---------- */
const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;

    /* Tìm user tồn tại trong DB */
    const user = await User.findById({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    /* Đổi Bio và lưu vào DB */
    user.bio = bio;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ Error: "Update bio failed", msg: error.message });
  }
};

/* ---------- UPDATE PHONE NUMBER ---------- */
const updatePhoneNumber = async (req, res) => {
  try {
    const { phone } = req.body;

    /* Tìm user tồn tại trong DB */
    const user = await User.findById({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    /* Đổi SĐT và lưu vào DB */
    user.phone = phone;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ Error: "Update phone number failed", msg: error.message });
  }
};

/* ---------- UPDATE PASSWORD ---------- */
const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    /* Tìm user tồn tại trong DB */
    const user = await User.findById({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    /* Hash password mới */
    const salt = bcryptjs.genSaltSync(10);
    const newHashPassword = bcryptjs.hashSync(password, salt);

    /* Đổi Password và lưu vào DB */
    user.password = newHashPassword;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ Error: "Update password failed", msg: error.message });
  }
};

/* ---------- UPDATE EMAIL ---------- */
const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;

    /* Tìm user tồn tại trong DB */
    const user = await User.findById({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    /* Đổi Email và lưu vào DB */
    user.email = email;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ Error: "Update email failed", msg: error.message });
  }
};

export {
  updateUsername,
  updateBio,
  updatePhoneNumber,
  updatePassword,
  updateEmail,
};
