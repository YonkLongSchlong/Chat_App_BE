import {
  loginService,
  registerService,
  verifyRegisterService,
} from "../services/AuthService.js";

/* ---------- REGISTER ---------- */
const register = async (req, res) => {
  try {
    const { phone } = req.body;
    const response = await registerService(phone);
    res.status(response.status).json(response.msg);
  } catch (error) {
    res.status(500).json({ Error: "Error creating OTP", msg: error.message });
  }
};

/* ---------- VERIFY REGISTER ---------- */
const verifyRegister = async (req, res) => {
  try {
    const { username, password, phone, otp } = req.body;
    const response = await verifyRegisterService(
      username,
      password,
      phone,
      otp
    );
    return res.status(response.status).json(response.msg);
  } catch (error) {
    res.status(500).json({ Error: "Error creating user", msg: error.message });
  }
};

/* ----------  LOGIN ----------  */
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const response = await loginService(res, phone, password);
    return res.status(response.status).json(response.msg);
  } catch (error) {
    res.status(500).json({ Error: "Error loging in user", msg: error.message });
  }
};

/* ----------  LOGOUT ----------  */
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.setHeader("Authorization", "");
    res.status(200).json("User logged out successfully");
  } catch (error) {
    res.status(500).json({ Error: "Error logout", msg: error.message });
  }
};

export { register, login, logout, verifyRegister };
