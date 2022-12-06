const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const User = require("../models/User");

router.put("/favorites/place", isAuthenticated, async (req, res) => {
  try {
    const userUpdated = req.user;

    console.log("userUpdated >>>", userUpdated);

    const newFavorite = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      adress: req.body.address,
      rating: req.body.rating,
      type: req.body.type,
      pnone: req.body.pnone,
      photoFvrt: req.body.photo,
    };
    console.log("newFavorite >>>", newFavorite);

    userUpdated.favorites.push(newFavorite);
    // console.log(userUpdated);
    // userUpdated.markModified("favorites");
    await userUpdated.save();
    // console.log(userUpdated);

    res.json({
      id: userUpdated.id,
      name: userUpdated.name,
      description: userUpdated.description,
      adress: userUpdated.address,
      rating: userUpdated.rating,
      type: userUpdated.type,
      pnone: userUpdated.pnone,
      photo: userUpdated.photoFvrt,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/favorites", isAuthenticated, async (req, res) => {
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

module.exports = router;
