import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
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
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
