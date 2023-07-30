const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  status: { type: Boolean, required: true, default: false },
  profilePic: {
    type: String,
    required: true,
    default:
      "https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
  },
});

module.exports = mongoose.model("User", userSchema);
