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
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://192.168.1.3:5173",

      "https://mern-stack-redux-blog-frontend.onrender.com/",
      "https://mern-stack-redux-blog-frontend.onrender.com",
    ],
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
