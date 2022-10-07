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
  carrera: {
    type: Schema.Types.ObjectId,
    ref: "Career",
    required: true,
  },
  location: {
    type: {
      lat: {
        type: Number,
        default: 21.13835514738178,
        required: true,
      },
      lng: {
        type: Number,
        default: -86.83559983786421,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
    },
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
  isActive: {
    type: Boolean,
    default: false,
  },
  aboutMe: {
    type: String,
  },
  contact: {
    type: {
      phone: String,
      email: String,
      linkedIn: String,
    },
  },
});

ProfileSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Profile", ProfileSchema);
