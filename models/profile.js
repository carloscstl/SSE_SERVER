const { Schema, model } = require("mongoose");

const ProfileSchema = Schema({
  control: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellido_Paterno: {
    type: String,
    required: true,
  },
  apellido_Materno: {
    type: String,
    required: true,
  },
  sexo: {
    type: String,
    required: true,
  },
  fecha_nacimiento: {
    type: Date,
    required: true,
  },
  carrera:{
    type:String,
    required: true
  },
  ingreso: {
    type: {
      anio: {
        type: String,
      },
      mes: {
        type: String,
      },
    },
  },
  egreso: {
    type: {
      anio: {
        type: String,
      },
      mes: {
        type: String,
      },
    },
  },
  isActive:{
    type:Boolean,
    default: false
  }
});

ProfileSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Profile", ProfileSchema);
