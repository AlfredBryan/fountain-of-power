const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  is_admin: {
    type: Boolean,
    default: false
  },
  full_name: {
  type: String,
  required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  department: {
    type: String,
    enum: [
      "none",
      "choir",
      "usher",
      "protocol",
      "prayer_group",
      "sunday_school",
      "technical_crew",
      "media_crew",
      "pastorate",
      "welfare",
      "youth"
    ],
    required: true
  },

  password: {
    type: String,
    required: true,
    unique: false,
  },
  address: {
    type: String,
    required: false
  },

  reg_date: {
    type: Date,
    required: true,
    default: Date.now()
  },

  image: {
    type: String,
    required: false,
    unique: false
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
