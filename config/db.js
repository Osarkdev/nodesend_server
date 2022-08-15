const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("database conectada");
    } catch (error) {
        console.log(error);
        console.log("hubo un error");
    }
}

module.exports = conectarDB;