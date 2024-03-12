import mongoose from "mongoose";

const FriendRequestSchema = mongoose.Schema(
  {
    id: mongoose.Schema.ObjectId,
    requester: {
      type: String,
      require: true,
    },
    recipent: {
      type: String,
      require: true,
    },
    status: {
      type: int,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);
export default FriendRequest;
