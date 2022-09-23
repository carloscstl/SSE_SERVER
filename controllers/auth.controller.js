const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Wrong Username",
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SEED,
        {
          expiresIn: "48h",
        }
      );

      console.log("token: " + token);

      res.status(200).json({
        status: true,
        user: user,
        token: token,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    console.log(error);
    serverError(res);
  }
  console.log(req.body);
};

const renewToken = async (req, res) => {
  try {
    const id = req.id;
    const role = req.role;

    const newToken = jwt.sign({ id, role }, process.env.JWT_SEED, {
      expiresIn: "48h",
    });

    const user = await User.findById(id);

    res.status(201).json({
      status: true,
      user: user,
      token: newToken,
    });
  } catch (error) {
    console.log(error);
    serverError(res);
  }
};

const serverError = (res) => {
  res.status(500).json({
    status: false,
    message: "SERVER ERROR",
  });
};

module.exports = {
  login,
  renewToken,
};
