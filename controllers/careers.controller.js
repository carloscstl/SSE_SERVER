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
  const { page = 1, limit = 10 } = req.query;

  const [total, careers] = await Promise.all([
    Career.countDocuments(),
    Career.find()
      .limit(limit)
      .skip((page - 1) * limit),
  ]);

  res.json({
    careers,
    total
  });
};

module.exports = {
  registerCareer,
  getCareers,
};
