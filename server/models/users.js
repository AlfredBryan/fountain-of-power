const mongoose = require("mongoose");

const { Schema } = mongoose;
const users = new Schema({
  is_admin: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    maxlength: 11
  },

  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },

  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
    maxlength: 6
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
    maxlength: 70
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

module.exports = mongoose.model("Users", users);
