const UserRole = require("../models/user_role");
const User = require("../models/user");
const Profile = require("../models/profile");
const bcrypt = require("bcrypt");
const { response } = require("express");

const newRole = async (req, res) => {
  try {
    const role_name = req.body.role;
    const exists = await UserRole.findOne({ role: role_name.toUpperCase() });
    if (exists) {
      res.status(400).json({
        status: false,
        message: "Role already exists.",
      });
    } else {
      const newUserRole = new UserRole(req.body);
      newUserRole.role = role_name.toUpperCase();
      await newUserRole.save();

      res.status(200).json({
        status: true,
        role: newUserRole,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "SERVER ERROR",
    });
  }
};

const newUser = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        status: false,
        message: "Username already exists.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "SERVER ERROR",
    });
  }
};

const activeProfile = async (req, res) => {

};

const registerProfile = async (req, res) => {
  const {
    username,
    nombre,
    apellido_Paterno,
    apellido_Materno,
    sexo,
    fecha_nacimiento,
  } = req.body;
  const profile = new Profile({
    control: username,
    nombre,
    apellido_Paterno,
    apellido_Materno,
    sexo,
    fecha_nacimiento,
  });

  await profile.save();

  res.json({ profile });
};

const getRoles = async (req, res) => {
  try {
    const roles = await UserRole.find();

    res.status(200).json({
      status: true,
      roles: roles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "SERVER ERROR",
    });
  }
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
    const { user } = req.params;
    console.log(user);
    const existingUser = await User.findOne({ username: user })
      .populate("role")
      .populate("profile");
    if (existingUser) {
      if (existingUser.profileActivated) {
        res.status(200).json({
          status: true,
          profile: existingUser.profile,
        });
      } else {
        res.status(404).json({
          status: false,
          message: `Profile not activated.`,
        });
      }
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
  newRole,
  newUser,
  activeProfile,
  registerProfile,

  getRoles,
  getUser,
  getProfile,
  getUsersByRole,

  updateProfile,
};
