const bcrypt = require("bcrypt");
const { response } = require("express");
const User = require("../models/user");

const createUser = async (req, res = response) => {
  try {
    const { name, username, password, permissions = ["read"] } = req.body;
    const existUser = await User.findOne({ username });

    if (existUser) {
      return res.status(400).json({
        status: false,
        message: "Username already exists.",
      });
    }

    const user = new User({ name, username, password, permissions });

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.json({
      status: true,
      msg: "User Created Succesfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "SERVER ERROR",
    });
  }
};

const getUser = async (req, res = response) => {
  try {
    const { user } = req.params;
    console.log(user);
    const existingUser = await User.findOne({ username: user }).populate(
      "role"
    );
    if (existingUser) {
      console.log("EXISTS");
      res.status(200).json({
        status: true,
        user: existingUser,
      });
    } else {
      console.log("DOES NOT EXIST");
      res.status(404).json({
        status: false,
        message: `User ${user} does not exist.`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "SERVER ERROR",
    });
  }
};

module.exports = {
  createUser,

  getUser,
};
