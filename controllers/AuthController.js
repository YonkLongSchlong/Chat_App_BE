import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

/* ---------- REGISTER ---------- */
const register = async (req, res) => {
  try {
    const { username, email, password, phone, bio, friendRequests, friends } =
      req.body;

    /* Tìm xem sđt đã được sử dụng hay chưa */
    const existUser = await User.findOne({ phone: phone });
    if (existUser) {
      return res
        .status(409)
        .json({ Error: "This phone number has already been registered" });
    }

    /* Hash password trước khi lưu vào DB */
    const salt = bcryptjs.genSaltSync(10);
    const hashPassword = bcryptjs.hashSync(password, salt);

    /* Tạo user và lưu vào DB */
    const user = await User.create({
      username: username,
      email: email,
      password: hashPassword,
      phone: phone,
      bio,
      friendRequests,
      friends,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ Error: "Error creating user", msg: error.message });
  }
};

/* ----------  LOGIN ----------  */
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    /* Tìm user có tồn tại trong DB */
    const user = await User.findOne({ phone: phone }).lean();
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    /* Check password */
    const validatePassword = bcryptjs.compareSync(password, user.password);
    if (!validatePassword) {
      return res.status(403).json({ Error: "Invalid credentials" });
    }

    user.password =
      undefined; /* Xóa password trước khi trả về cho người dùng */

    const token = generateToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ Error: "Error loging in user", msg: error.message });
  }
};

/* ----------  LOGOUT ----------  */
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json("User logged out successfully");
  } catch (error) {
    res.status(500).json({ Error: "Error logout", msg: error.message });
  }
};

export { register, login, logout };
