const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Validator = require("validator");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
require("dotenv").config();

const User = require("../models/users");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "profilepics",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const upload = multer({ storage: storage }).single("image");

router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then(user => {
    res.send(user);
  });
});

router.get("/users", (req, res) => {
  User.find({}).then(users => {
    if (users.length < 1) {
      res.status(404).send({ message: "users not found" });
    }

    res
      .status(200)
      .send({ successful: true, message: "found users", data: users });
  });
});

router.post("/user/signup", upload, (req, res) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  const errors = [];
  let {
    full_name,
    department,
    address,
    email,
    phone,
    gender,
    password
  } = req.body;
  if (full_name.length < 5 || full_name === Number) {
    errors.push({
      message:
        "your name can have a min length of 5 char and cannot be a number"
    });
  }
  if (department.length < 4) {
    errors.push({
      message: "you can have a min length of 5 char"
    });
  }
  if (address.length < 10) {
    errors.push({
      message: "you can have a min length of 10 char"
    });
  }
  if (Validator.isEmpty(email) || !Validator.isEmail(email)) {
    errors.push({
      message: "email invalid"
    });
  }
  if (Validator.isEmpty(phone) || !Validator.isNumeric(phone)) {
    errors.push({
      message: "Please enter your number"
    });
  }
  if (
    Validator.isEmpty(password) ||
    !Validator.isLength(password, { min: 6, max: 20 })
  ) {
    errors.push({
      message:
        "your name can have a min length of 5 char and cannot be a number"
    });
  }
  if (errors.length > 0) {
    res.status(422).send({ success: false, Error: errors });
  } else {
    User.create(
      {
        full_name,
        address,
        gender,
        department,
        phone,
        email,
        password,
        image: req.file.url
      },
      (err, user) => {
        if (err) return res.status(409).send({ message: err.message });
        console.log(user);
        //create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h"
        });
        res.status(201).send({ token: token });
      }
    );
  }
});

router.post("/user/login", (req, res) => {
  User.findOne({ phone: req.body.phone }, (err, user) => {
    if (err) return res.status(500).send({ message: "login error" });
    if (!user) return res.status(404).send({ message: "user not found" });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid)
      return res.status(403).send({ message: "login invalid" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.json({
      user: user,
      message: "Authenticated",
      token: token
    });
  });
});

router.delete("/user/delete/:id", (req, res) => {
  User.findOneAndRemove(req.params.id, err => {
    if (err) return next(err);
    res.send("Deleted successfully!");
  });
});

router.put("/user/update/:id", (req, res, next) => {
  User.findOneAndUpdate(req.params.id, { $set: req.body }, (err, user) => {
    if (err) return next(err);
    res.status(200).send({ user: user.username, message: "Update Successful" });
  });
});

// GET /logout
router.get("/logout", function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

module.exports = router;
