const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("../middlewares/isAuthenticated");

cloudinary.config({
  cloud_name: "dcvjq7vzd",
  api_key: "815923738358717",
  api_secret: "JVXyodgeMt-hIniBlFjPlbltI7M",
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.name || !req.body.password || !req.body.email) {
      return res.status(400).json({ message: "Fill all fields" });
    }

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ message: "This mail has alredy been used" });
    }

    const password = req.body.password;

    const salt = uid2(16);

    const hash = SHA256(password + salt).toString(encBase64);

    const token = uid2(64);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      token: token,
      salt: salt,
      hash: hash,
    });

    await newUser.save();

    res.status(200).json({
      name: newUser.name,
      email: newUser.email,
      token: newUser.token,
      id: newUser._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(200).json({ message: "Fill all fields" });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "There is no account with this email" });
    }

    const newPassword = req.body.password;
    const newSalt = user.salt;
    const newHash = SHA256(newPassword + newSalt).toString(encBase64);

    if (newHash !== user.hash) {
      return res
        .status(400)
        .json({ message: "Your email or password is not correct" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      token: user.token,
      id: user._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/user/:id", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      name: user.name,
      email: user.email,
      photo: user.photo,
    });
  } catch (error) {
    console.log({ error: error.message });
  }
});

router.put("/user/update", isAuthenticated, fileUpload(), async (req, res) => {
  try {
    const userToUpdate = req.user;

    if (!req.body.name && !req.body.email && !req.files?.image) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    if (req.body.name) {
      userToUpdate.name = req.body.name;
    }
    if (req.body.email) {
      userToUpdate.email = req.body.email;
    }

    if (req.files?.image) {
      try {
        const photoToUpload = req.files.image;
        const photoUser = await cloudinary.uploader.upload(
          convertToBase64(photoToUpload, {
            folder: `/happy-cow/user`,
          })
        );

        userToUpdate.photo = photoUser;
      } catch (error) {
        return res.status(400).json({ message: "No photo chose" });
      }
    }

    await userToUpdate.save();
    console.log(userToUpdate);
    res
      .status(200)
      .json({ message: "You have successeufully updated your information" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
