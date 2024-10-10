const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["follow", "like", "comment"], required: true },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: function () {
      return this.type !== "follow";
    },
  },
  fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
