const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://MariiaMERCIER:OH1VDRS84wrBKigy@cluster0.skkxw59.mongodb.net/happy-cow"
);

const UserRoutes = require("./routes/user");
app.use(UserRoutes);

const FavoritesRoutes = require("./routes/favorites");
app.use(FavoritesRoutes);

app.all("/*", (req, res) => {
  res.json({ message: "No route with this name" });
});
app.listen(4000, () => {
  console.log("Server started");
});
