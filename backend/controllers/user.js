var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var User = require("../models/user.js");

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

const validatePassword = (pw) => {
  return (
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw) &&
    pw.length > 4
  );
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );
    return res.status(200).json({ result: existingUser, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again." });
  }
};

exports.signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    if (validateEmail(email) === false) {
      return res
        .status(400)
        .json({ message: "Invalid Email Id. Enter a valid email." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "User already exists" });
    }
    if (validatePassword(password) === false) {
      return res.status(404).json({
        message:
          "Error. Password must be minimum 5 characters and contain one uppercase, one lowercase character, one digit and one symbol",
      });
    }
    if (password != confirmPassword) {
      return res.status(404).json({ message: "Passwords don't match" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });
    res.status(200).json({ result, token });
  } catch (error) {
    returres.status(500).json({ message: "Something went wrong. Try again." });
  }
};

exports.verify = async (req, res) => {
  const userId = req.userId;
  try {
    return res.status(200).json({ userId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login again. JWT invalid or expired" });
  }
};
