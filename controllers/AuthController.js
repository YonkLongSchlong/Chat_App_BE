import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { generateOtp } from "../utils/generateOtp.js";
import Otp from "../models/Otp.js";

/* ---------- REGISTER ---------- */
const register = async (req, res) => {
  try {
    const { phone } = req.body;

    /* Tìm xem sđt đã được sử dụng hay chưa */
    const existUser = await User.findOne({ phone: phone });
    if (existUser) {
      return res
        .status(409)
        .json({ Error: "This phone number has already been registered" });
    }

    /* Tạo Otp */
    const genOtp = generateOtp();
    console.log("Otp is:" + genOtp);

    /* Mã hóa otp */
    const salt = bcryptjs.genSaltSync(10);
    const hashOtp = bcryptjs.hashSync(genOtp, salt);
    const otp = await Otp.create({
      phone: phone,
      otp: hashOtp,
    });

    res.status(201).json(otp);
  } catch (error) {
    res.status(500).json({ Error: "Error creating OTP", msg: error.message });
  }
};

/* ---------- VERIFY REGISTER ---------- */
const verifyRegister = async (req, res) => {
  try {
    const { username, email, password, phone, otp } = req.body;

    /* Tìm OTP đã được tạo với SĐT trong DB */
    const OtpHolder = await Otp.find({ phone: phone });

    if (!OtpHolder) {
      return res.status(404).json({ Error: "OTP is expired" });
    }

    /* Lấy OTP cuối cùng được gửi và kiểm tra với OTP user nhập*/
    const lastOtp = OtpHolder[OtpHolder.length - 1];
    const validateOtp = bcryptjs.compareSync(otp, lastOtp.otp);
    if (!validateOtp) {
      return res.status(400).json({ Error: "Invalid OTP" });
    }

    /* Check hợp lệ OTP và SĐT người dùng sử dụng 
       Nếu hợp lệ tạo User và lưu vào DB
    */
    if (validateOtp && phone === lastOtp.phone) {
      /* Mã hóa password trước khi lưu vào DB */
      const salt = bcryptjs.genSaltSync(10);
      const hashPassword = bcryptjs.hashSync(password, salt);

      /* Tạo user và lưu vào DB */
      const user = await User.create({
        username: username,
        email: email,
        password: hashPassword,
        phone: phone,
      });

      /* Xóa các OTP của SĐT đăng ký đã được lưu trong DB */
      if (user) {
        await Otp.deleteMany({
          phone: phone,
        });
      }

      user.password =
        undefined; /* Xóa password trước khi trả về cho người dùng */

      return res.status(201).json(user);
    }

    res.status(404).json({
      Error: "This is not the phone number that are used to register",
    });
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
    // res.cookie("jwt", token, { httpOnly: true });
    res.setHeader("authorization", `Bearer ${token}`);
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

export { register, login, logout, verifyRegister };
