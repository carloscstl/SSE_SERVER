const express = require('express');
const http = require('http');
//const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { dbConnection } = require('./database/config');
const fileUpload = require('express-fileupload');

//const Sockets = require('./sockets');
//const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Conectar a db
        dbConnection();

        // Http server
        this.server = http.createServer(this.app);

        // Configuraciones de sockets
        //   this.io = socketio( this.server, {/* configuraciones */} );

    }

    middlewares() {
        this.app.use(express.static(path.resolve(__dirname, '../public')));

        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(fileUpload());

        this.app.use('/api/auth', require('./routes/auth.routes'));
        this.app.use('/api/users', require('./routes/users.routes'));
        this.app.use('/api/events', require('./routes/events.routes'));
        this.app.use('/api/uploads', require('./routes/uploads.routes'));
    }

    execute() {
        // Inicializar Middlewares
        this.middlewares();

        // Inicializar Sockets
        // this.configSockets();

        // Inicializar Server
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        })
    }

}

module.exports = Server;