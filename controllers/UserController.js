import {
  updateBioService,
  updatePhoneService,
  updateUsernameService,
  updatePasswordService,
  friendRequestService,
  friendAcceptService,
  getAllFriendsRequestService,
} from "../services/UserService.js";

/* ---------- UPDATE USERNAME ---------- */
const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const { id } = req.params;
    const user = req.user;

    const response = await updateUsernameService(user, id, username);
    return res.status(response.status).json(response.msg);
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
    const { id } = req.params;
    const user = req.user;

    const response = await updateBioService(user, id, bio);
    return res.status(response.status).json(response.msg);
  } catch (error) {
    res.status(500).json({ Error: "Update bio failed", msg: error.message });
  }
};

/* ---------- UPDATE PHONE NUMBER ---------- */
const updatePhoneNumber = async (req, res) => {
  try {
    const { phone } = req.body;
    const { id } = req.params;
    const user = req.user;

    const response = await updatePhoneService(user, id, phone);
    return res.status(response.status).json(response.msg);
  } catch (error) {
    res
      .status(500)
      .json({ Error: "Update phone number failed", msg: error.message });
  }
};

/* ---------- UPDATE PASSWORD ---------- */
const updatePassword = async (req, res) => {
  try {
    const { newPassword, oldPassword } = req.body;
    const { id } = req.params;
    const user = req.user;

    const response = await updatePasswordService(
      user,
      id,
      oldPassword,
      newPassword
    );
    return res.status(response.status).json(response.msg);
  } catch (error) {
    res
      .status(500)
      .json({ Error: "Update password failed", msg: error.message });
  }
};

/* ---------- FRIEND REQUEST ---------- */
const friendRequest = async (req, res) => {
  try {
    const { id, recipentId } = req.params;
    const user = req.user;

    const response = await friendRequestService(user, id, recipentId);
    return res.status(response.status).json(response.msg);
  } catch (error) {
    return res.status(500).json({
      Error: "Something went wrong in friend request feature",
      msg: error,
    });
  }
};

/* ---------- FRIEND ACCEPT ---------- */
const friendAccept = async (req, res) => {
  try {
    const { id, requesterId } = req.params;
    const user = req.user;

    const response = await friendAcceptService(user, id, requesterId);
    return res.status(response.status).json(response.msg);
  } catch (error) {
    return res.status(500).json({
      Error: "Something went wrong in friend accept feature",
      msg: error,
    });
  }
};

/* ---------- GET ALL FRIENDS REQUEST ---------- */
const getAllFriendsRequest = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const response = await getAllFriendsRequestService(user, id);
    return res.status(response.status).json(response.msg);
  } catch (error) {
    return res.status(500).json({
      Error: "Something went wrong in get friend requests",
      msg: error.message,
    });
  }
};

export {
  updateUsername,
  updateBio,
  updatePhoneNumber,
  updatePassword,
  friendRequest,
  friendAccept,
  getAllFriendsRequest,
};
