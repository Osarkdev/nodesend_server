const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//inicializamos la app
const app = express();

//conectardb
conectarDB();

//habilitar cors
/* const opcionesCors = {
    origin: process.env.FRONTEND
} */
app.use(cors());

//creamos el puerto
const port = process.env.PORT || 4000;

//para utilizar json
app.use(express.json());

//habilitar carpeta publica
app.use(express.static('uploads'));

//creando las rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto${port}`);
})