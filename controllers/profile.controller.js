const { response } = require("express");
const bcrypt = require("bcrypt");

const Profile = require("../models/profile");
const User = require("../models/user");
const Career = require("../models/careers");

const registerProfile = async (req, res = response) => {
  const { username, codigo_carrera, ...rest } = req.body;

  const existProfile = await Profile.findOne({ control: username });

  if (existProfile) {
    return res.status(400).json({
      status: false,
      msg: `Profile ${username} already Exists`,
    });
  }

  const careerExist = await Career.findOne({ codigo_carrera });

  if (!careerExist) {
    return res.status(400).json({
      status: false,
      msg: "Carrera no existe",
    });
  }

  const careerId = careerExist._id;

  const profile = new Profile({
    control: username,
    carrera: careerId,
    ...rest,
  });

  await profile.save();

  res.json({ status: true, msg: "Profile Registered Succesfully", profile });
};

const activateProfile = async (req, res = response) => {
  const { username, password, apellido_Paterno } = req.body;

  const userProfile = await Profile.findOne({
    control: username,
    apellido_Paterno,
  });

  if (!userProfile) {
    return res.status(404).json({ status: false, error: "Profile Not Found" });
  }

  const profileId = userProfile._id;
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
    profileId,
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

const getProfile = async (req, res = response) => {
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
    res.status(500).json({
      status: false,
      message: "SERVER ERROR",
    });
  }
};

const getProfilesByCareer = async (req, res = response) => {
  const page = Number(req.query.page) || 1;

  let { codigo_carrera } = req.params;
  codigo_carrera = codigo_carrera.toUpperCase();

  const existCareer = await Career.findOne({ codigo_carrera });

  if (!existCareer) {
    return res.status(404).json({
      status: false,
      msg: "Career Not Found",
    });
  }
  const careerId = existCareer._id;

  const profiles = await Profile.find({ carrera: careerId })
    .skip((page - 1) * 10)
    .limit(10);

  res.json({
    profiles,
    page,
  });
};

const updateProfile = async (req, res) => {
  const { username } = req.params;
  const { contact, aboutMe } = req.body;

  try {
    const profileExists = await Profile.findOne({
      control: username,
      isActive: true,
    });
    if (!profileExists) {
      return res.status(400).json({
        status: false,
        msg: "Profile not Found or Not active",
      });
    }
    await Profile.updateOne(
      {
        control: username,
      },
      { contact, aboutMe }
    );
    res.json({
      contact,
      aboutMe,
      username,
    });
  } catch (err) {
    res.status(500).json({ status: false, msg: "Server Error", err });
  }
};

const updateLocation = async (req, res = response) => {
  const { color} = req.body;
  const {username} = req.params
  let { lat, lng } = req.body;

  const profileExists = await Profile.find({
    control: username,
  });

  if (!profileExists) {
    return res.status(404).json({
      status: false,
      msg: "Profile Not Found",
    });
  }

  // lat = Number(lat);
  // lng = Number(lng);

  // await Profile.updateOne(
  //   {
  //     control: username,
  //   },
  //   {
  //     location: {
  //       lat: lat,
  //       lng: lng,
  //       color,
  //     },
  //   }
  // );

  res.json({
    status: true,
    msg: "Location Added Succesfully",
    username,
    // profileExists,
    lat,
    lng,
  });
};

module.exports = {
  activateProfile,
  registerProfile,

  getProfile,
  getProfilesByCareer,

  updateProfile,
  updateLocation,
};
