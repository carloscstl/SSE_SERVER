const { response } = require("express");
const Career = require("../models/careers");

const registerCareer = async (req, res = response) => {
  const { carrera, codigo_carrera } = req.body;

  const existCareer = await Career.findOne({
    codigo_carrera,
  });
  if (existCareer) {
    return res.status(400).json({
      status: false,
      msg: "Carrera anteriormente registrada",
    });
  }

  const career = new Career({
    carrera,
    codigo_carrera,
  });
  await career.save();

  res.json({
    status: true,
    msg: "Carrera registrada correctamente",
    career,
  });
};

const getCareers = async (req, res = response) => {
    const careers = await Career.find();

    res.json({
        careers
    });
};

module.exports = {
  registerCareer,
  getCareers
};
