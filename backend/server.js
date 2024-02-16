const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const profileRoutes = require("./routes/profileRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.1.3:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL);

app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);
app.use("/profile", profileRoutes);
app.use("/comments", commentsRoutes);
app.use("/notifications", notificationsRoutes);

app.use("/", (req, res) => {
  res.send("this is the home page");
});

app.listen(process.env.PORT, () => {
  console.log("this server is opened at " + process.env.PORT);
});
