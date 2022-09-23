const bcrypt = require("bcrypt");
const { response } = require("express");
const User = require("../models/user");
const Profile = require("../models/profile");

// *Create New User

const createUser = async (req, res) => {
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

// *REGISTER PROFILE

const registerProfile = async (req, res) => {
  const { username, ...rest } = req.body;

  const existProfile = await Profile.findOne({ control: username });

  if (existProfile) {
    return res.status(400).json({
      status: false,
      msg: `Profile ${username} already Exists`,
    });
  }

  const profile = new Profile({
    control: username,
    ...rest,
  });

  await profile.save();

  res.json({ status: true, msg: "Profile Registered Succesfully", profile });
};

// *ACTIVATE PROFILE

const activateProfile = async (req, res) => {
  const { username, password, apellido_Paterno } = req.body;

  const userProfile = await Profile.findOne({
    control: username,
    apellido_Paterno,
  });

  if (!userProfile) {
    return res.status(404).json({ status: false, error: "Profile Not Found" });
  }

  const existUser = await User.findOne({ username });

  if (existUser) {
    return res.status(400).json({
      status: false,
      msg: "User already Exist",
    });
  }

  const user = new User({
    name: userProfile.nombre,
    username,
    password,
    permissions: ["read"],
  });

  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  await user.save();

  await Profile.updateOne(
    {
      control: username,
      apellido_Paterno,
    },
    {
      isActive: true,
    }
  );
  res.json({
    status: true,
    msg: "User Activated Succesfully",
    user,
  });
};

const getUser = async (req, res) => {
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

const getProfile = async (req, res) => {
  try {
    const { control } = req.params;
    const profile = await Profile.findOne({ control });

    if (!profile) {
      return res.status(404).json({
        status: false,
        msg: "Profile Not Found",
      });
    }

    res.json({
      status: true,
      profile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "SERVER ERROR",
    });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const { role } = req.params;

    const existingRole = await UserRole.findOne({ role: role.toUpperCase() });

    if (!existingRole) {
      res.status(400).json({
        status: false,
        message: "Invalid Role.",
      });
    } else {
      const usersTotal = await User.find({ role: existingRole._id });

      const users = await User.find({ role: existingRole._id })
        .skip((page - 1) * 20)
        .limit(20);

      res.status(200).json({
        status: true,
        users: users,
        total: usersTotal.length,
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

const getProfilesByCareer = async (req, res) => {
  const { carrera } = req.params;

  const profiles = await Profile.find({ carrera, isActive: true });

  if (!profiles) {
    return res.status(404).json({
      status: false,
      msg: "Profiles Not Founded",
      carrera,
    });
  }

  res.json({ profiles });
};

const updateProfile = async (req, res) => {
  //TODO: FIX!!!
  console.log("REQUEST: " + req.body.id);
  const updatedProfile = req.body;

  const dbProfile = await Profile.findByIdAndUpdate(updatedProfile.id, {
    ...updateProfile,
  });
  console.log("PROFILE FOUND: " + dbProfile.id);

  if (dbProfile) {
    await dbProfile.save();
    return res.status(201).json({
      status: true,
      message: "Profile updated",
    });
  }

  res.status(400).json({
    status: false,
    message: "Profile not found",
  });

  try {
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
  activateProfile,
  registerProfile,

  getUser,
  getUsersByRole,
  getProfile,
  getProfilesByCareer,

  updateProfile,
};
