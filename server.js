const cors = require("cors");
const express = require("express");
const http = require("http");
const morgan = require("morgan");

const { dbConnection } = require("./database/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    // Conectar a db
    dbConnection();

    // Http server
    this.server = http.createServer(this.app);
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(fileUpload());

    this.app.use("/api/auth", require("./routes/auth.routes"));
    this.app.use("/api/users", require("./routes/users.routes"));
    this.app.use("/api/events", require("./routes/events.routes"));
    this.app.use("/api/uploads", require("./routes/uploads.routes"));
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en puerto:", this.port);
    });
  }
}

module.exports = Server;