// models/Story.js

const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  membersLiked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  verify: {
    type: Boolean,
    default: false,
    required: true,
  },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
