const { Schema, model } = require("mongoose");

const CareerSchema = Schema({
  carrera: {
    type: String,
    required: true,
  },
  codigo_carrera:{
    type:String,
    required: true,
  }
});

CareerSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Career", CareerSchema);