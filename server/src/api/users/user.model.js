const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    userImage: { type: String, default: null },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
