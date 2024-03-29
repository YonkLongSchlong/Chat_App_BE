import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

/* ---------- UPDATE USERNAME ---------- */
export const updateUsernameService = async (user, id, username) => {
  /* Kiểm tra xem ID ở phần params có đúng với ID của user đã được verify hay không */
  if (id !== user._id.toString()) {
    return {
      status: 403,
      msg: "User not verified",
    };
  }

  /* Đổi username và lưu vào DB trả về 200 */
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

  /* Đổi Bio và lưu vào DB trả về 200*/
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

  /* Đổi SĐT và lưu vào DB trả về 200*/
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

  /* Kiểm tra pass nếu ko hợp lệ trả về 404 */
  const checkPassword = bcryptjs.compareSync(oldPassword, user.password);
  if (!checkPassword) {
    return {
      status: 404,
      msg: "Old password does not match",
    };
  }

  /* Nếu hợp lệ hash password mới */
  const salt = bcryptjs.genSaltSync(10);
  const newHashPassword = bcryptjs.hashSync(newPassword, salt);

  /* Đổi Password và lưu vào DB trả về 200*/
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

  /* Nếu user nhận lời mời không tồn tại trả về 404 */
  const receipent = await User.findById({ _id: recipentId }).lean();
  if (!receipent) {
    return {
      status: 404,
      msg: "Receipent not found",
    };
  }

  /* Nếu user đã gửi lời mời trả về 203 */
  const checkFriendShip = await FriendRequest.findOne({
    requester: user._id.toString(),
    recipent: recipentId,
  }).lean();
  if (checkFriendShip) {
    return {
      status: 203,
      msg: "Request was already exist",
    };
  }

  /* Nếu user chưa gửi lời mời tiến hành tạo friend request trả về 201 */
  const friendShip = await FriendRequest.create({
    requester: user._id.toString(),
    recipent: recipentId,
    status: 1,
  });
  return {
    status: 201,
    msg: friendShip,
  };
};

/* ---------- FRIEND ACCEPT ---------- */
export const friendAcceptService = async (user, id, requesterId) => {
  /* Kiểm tra xem ID ở phần params có đúng với ID của user đã được verify hay không */
  if (id !== user._id.toString()) {
    return {
      status: 404,
      msg: "User not verified",
    };
  }

  /* Kiểm tra xem user đã kết bạn với người gửi lời mời hay chưa */
  const checkFriend = user.friends.includes(requesterId).lean();
  if (checkFriend) {
    return {
      status: 203,
      msg: "You have already been friend",
    };
  }

  /* Query lấy thông tin user gửi lời mời và friend request dưới DB */
  const result = await Promise.all([
    FriendRequest.findOne({
      requester: requesterId,
      recipent: user._id.toString(),
    }).exec(),
    User.findOne({
      _id: requesterId,
    }).exec(),
  ]);

  /* Nếu result không trả về undefined tiến hành thực hiện:
    1. Đổi status của lời mời kết bạn thành 2 = đã kết bạn
    2. Push ID của người gửi và ID của người nhận vào list friend của 2 bên
    3. Lưu xuống dưới DB trả về 200
  */
  if (!result) {
    return {
      status: 404,
      msg: "Friend request or user not found",
    };
  }
  const requester = result[0];
  const friendRequest = result[1];

  friendRequest.status = 2;
  user.friends.push(requesterId);
  requester.friends.push(user._id.toString());

  return {
    status: 200,
    msg: await Promise.all([
      friendRequest.save(),
      user.save(),
      requester.save(),
    ]),
  };
};

/* ---------- GET ALL FRIEND REQUESTS ---------- */
export const getAllFriendsRequestService = async (user, id) => {
  /* Kiểm tra xem ID ở phần params có đúng với ID của user đã được verify hay không */
  if (id !== user._id.toString()) {
    return {
      status: 404,
      msg: "User not verified",
    };
  }

  const response = await FriendRequest.find({
    recipent: user._id,
    status: 1,
  });

  if (response.length <= 0) {
    return {
      status: 200,
      msg: "There no friend requests found",
    };
  }

  return {
    status: 200,
    msg: response,
  };
};
