const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const User = require("../models/User");

router.put("/favorites/place", isAuthenticated, async (req, res) => {
  try {
    const userUpdated = req.user;

    for (let i = 0; i < userUpdated.favorites; i++) {
      if (userUpdated.favorites.id === req.body.id) {
        return res.status(400).json("This place has already been in your list");
      }
    }

    const newFavorite = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      adress: req.body.address,
      rating: req.body.rating,
      kitchenType: req.body.type,
      pnone: req.body.pnone,
      photoFvrt: req.body.photo,
    };

    userUpdated.favorites.push(newFavorite);

    await userUpdated.save();
    userUpdated.markModified("favorites");
    res.status(200).json({
      message: "You have just added your favorite place",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/favorites/delete", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    const newFavorites = user.favorites.filter(
      (favorite) => favorite.id !== req.body.id
    );

    user.favorites = newFavorites;
    await user.save();
    console.log(user.favorites);
    res.status(200).json({ message: "The favorite place is deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      favorites: user.favorites,
    });
  } catch (error) {
    console.log({ error: error.message });
  }
});

module.exports = router;
