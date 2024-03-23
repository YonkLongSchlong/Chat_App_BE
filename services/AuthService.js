import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { generateOtp } from "../utils/generateOtp.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

/* ---------- REGISTER ---------- */
export const registerService = async (phone) => {
  /* Tìm xem sđt đã được sử dụng hay chưa */
  const existUser = await User.findOne({ phone: phone }).lean();
  if (existUser) {
    return {
      status: 409,
      msg: "This phone number has already been registered",
    };
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

  return {
    status: 200,
    msg: otp,
  };
};

/* ---------- VERIFY REGISTER ---------- */
export const verifyRegisterService = async (username, password, phone, otp) => {
  /* Tìm OTP đã được tạo với SĐT trong DB */
  const OtpHolder = await Otp.find({ phone: phone });
  if (OtpHolder.length <= 0) {
    return {
      status: 404,
      msg: "OTP is expired",
    };
  }

  /* Lấy OTP cuối cùng được gửi và kiểm tra với OTP user nhập*/
  const lastOtp = OtpHolder[OtpHolder.length - 1];
  const validateOtp = bcryptjs.compareSync(otp, lastOtp.otp);
  if (!validateOtp) {
    return {
      status: 400,
      msg: "Invalid OTP",
    };
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

    return {
      status: 201,
      msg: user,
    };
  }
  return {
    status: 404,
    msg: "This is not the phone number that are used to register",
  };
};

/* ----------  LOGIN ----------  */
export const loginService = async (res, phone, password) => {
  /* Tìm user có tồn tại trong DB */
  const user = await User.findOne({ phone: phone }).lean();
  if (!user) {
    return {
      status: 404,
      msg: "User not found",
    };
  }

  /* Check password */
  const validatePassword = bcryptjs.compareSync(password, user.password);
  if (!validatePassword) {
    return {
      status: 403,
      msg: "Invalid credentials",
    };
  }

  user.password = undefined; /* Xóa password trước khi trả về cho người dùng */

  const token = generateToken(user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  user.token = token;
  // res.setHeader("authorization", `Bearer ${token}`);
  return {
    status: 200,
    msg: user,
  };
};
