import bcryptjs from "bcryptjs";
import User from "../models/User.js";

/* ---------- UPDATE USERNAME ---------- */
export const updateUsernameService = async (user, id, username) => {
  /* Kiểm tra xem ID ở phần params có đúng với ID của user đã được verify hay không */
  if (id !== user._id.toString()) {
    return {
      status: 403,
      msg: "User not verified",
    };
  }

  /* Đổi username và lưu vào DB */
  user.username = username;
  await user.save();
  return {
    status: 200,
    msg: user,
  };
};

/* ---------- UPDATE BIO ---------- */
export const updateBioService = async (user, id, bio) => {
  /* Kiểm tra xem ID ở phần params có đúng với ID của user đã được verify hay không */
  if (id !== user._id.toString()) {
    return {
      status: 403,
      msg: "User not verified",
    };
  }

  /* Đổi Bio và lưu vào DB */
  user.bio = bio;
  await user.save();
  return {
    status: 200,
    msg: user,
  };
};

/* ---------- UPDATE PHONE NUMBER ---------- */
export const updatePhoneService = async (user, id, phone) => {
  /* Kiểm tra xem ID ở phần params có đúng với ID của user đã được verify hay không */
  if (id !== user._id.toString()) {
    return {
      status: 403,
      msg: "User not verified",
    };
  }

  /* Đổi SĐT và lưu vào DB */
  user.phone = phone;
  await user.save();
  return {
    status: 200,
    msg: user,
  };
};

/* ---------- UPDATE PASSWORD ---------- */
export const updatePasswordService = async (
  user,
  id,
  oldPassword,
  newPassword
) => {
  /* Kiểm tra xem ID ở phần params có đúng với ID của user đã được verify hay không */
  if (id !== user._id.toString()) {
    return {
      status: 403,
      msg: "User not verified",
    };
  }

  const checkPassword = bcryptjs.compareSync(oldPassword, user.password);

  if (!checkPassword) {
    return {
      status: 404,
      msg: "Old password does not match",
    };
  }

  /* Hash password mới */
  const salt = bcryptjs.genSaltSync(10);
  const newHashPassword = bcryptjs.hashSync(newPassword, salt);

  /* Đổi Password và lưu vào DB */
  user.password = newHashPassword;
  await user.save();
  return {
    status: 200,
    msg: user,
  };
};

/* ---------- FRIEND REQUEST ---------- */
export const friendRequestService = async (user, id, recipentId) => {
  /* Kiểm tra xem ID ở phần params có đúng với ID của user đã được verify hay không */
  if (id !== user._id.toString()) {
    return {
      status: 403,
      msg: "User not verified",
    };
  }

  const receipent = await User.findById({ _id: recipentId });
  if (!receipent) {
    return {
      status: 404,
      msg: "Receipent not found",
    };
  }

  user.friends.push(recipentId);
  user.save();
};
