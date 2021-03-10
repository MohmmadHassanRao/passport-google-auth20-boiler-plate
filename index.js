const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport-setup");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: "test-session",
    keys: ["key1", "key2"],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.send("Hello world");
});
app.get("/failure", (req, res) => {
  res.send("failed to login");
});
app.get("/welcome", (req, res) => {
  res.send(`welcome ${req.user.displayName}| email: ${req.user._json.email}`);
  console.log(req.user);
  console.log(req.user._json.email);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/welcome",
    failureRedirect: "/failure",
  })
);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
