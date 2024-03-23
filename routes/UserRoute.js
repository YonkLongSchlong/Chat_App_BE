import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  friendAccept,
  friendRequest,
  getAllFriendsRequest,
  updateBio,
  updatePassword,
  updatePhoneNumber,
  updateUsername,
} from "../controllers/UserController.js";
const router = express.Router();

router.patch("/:id/username", verifyToken, updateUsername);
router.patch("/:id/bio", verifyToken, updateBio);
router.patch("/:id/phone", verifyToken, updatePhoneNumber);
router.patch("/:id/password", verifyToken, updatePassword);
router.post("/:id/:recipentId", verifyToken, friendRequest);
router.put("/:id/:requesterId/accept", verifyToken, friendAccept);
router.get("/:id/friendrequest", verifyToken, getAllFriendsRequest);

export default router;
