import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  updateBio,
  // updateEmail,
  updatePassword,
  updatePhoneNumber,
  updateUsername,
} from "../controllers/UserController.js";
const router = express.Router();

router.patch("/:id/username", verifyToken, updateUsername);
router.patch("/:id/bio", verifyToken, updateBio);
router.patch("/:id/phone", verifyToken, updatePhoneNumber);
router.patch("/:id/password", verifyToken, updatePassword);
// router.patch("/:id/email", verifyToken, updateEmail);
router.put("/:id/:recipentId", verifyToken, () => {});

export default router;
