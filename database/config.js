const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('DB online')

    } catch ( err ) {
        console.log( err );
        throw new Error('Error en la base de datos');
    }


}


module.exports = {
    dbConnection
}