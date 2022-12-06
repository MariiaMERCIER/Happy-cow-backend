const mongoose = require("mongoose");

const User = mongoose.model("User", {
  name: String,
  email: String,
  token: String,
  hash: String,
  salt: String,
  photo: Object,
  favorites: [
    {
      id: String,
      name: String,
      description: String,
      adress: String,
      rating: String,
      kitchenType: String,
      phone: String,
      photoFvrt: String,
    },
  ],
});

module.exports = User;
