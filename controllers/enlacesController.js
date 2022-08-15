const Enlaces = require("../models/Enlace");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const {validationResult} = require('express-validator');

exports.nuevoEnlace = async (req, res, next) => {
  //mostrar mensajes de error de express validator
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Crear un objeto enlace
  const { nombre_original, nombre } = req.body;

  const enlace = new Enlaces();

  enlace.url = shortid.generate();
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;

  //si el usuario esta autenticado
  if (req.usuario) {
    const { password, descargas } = req.body;

    if (descargas) {
      enlace.descargas = descargas;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash(password, salt);
    }

    //asignar el autor
    enlace.autor = req.usuario.id;
  }

  //Almacenar en la DB
  try {
    await enlace.save();
    res.json({ msg: `${enlace.url}` });
    next();
  } catch (error) {
    console.log(error);
  }
};

//para obtener todos los elementos
exports.obtenerTodos = async (req, res) => {
  try {
    const enlaces = await Enlaces.find({}).select('url -_id');
    res.json({enlaces});
  } catch (error) {
    console.log(error);
  }
}

exports.tienePassword = async (req, res, next) => {
  const {url} = req.params;  

  //verificar si existe el enlace
  const enlace = await Enlaces.findOne({url: req.params.url});

  if(!enlace){
    res.status(404).json({msg: "ese enlace no existe"});
    return next();
  }

  if(enlace.password){
    res.json({password: true, enlace: enlace.url})
  }

  next();
}

exports.verificarPassword = async (req, res, next) => {
  const {url} = req.params;
  const {password} = req.body;

  const enlace = await Enlaces.findOne({url});

  if(bcrypt.compareSync(password, enlace.password)){
    next();
  } else {
    return res.status(401).json({msg: 'Password incorrecto'});
  }
}

exports.obtenerEnlace = async (req, res, next) => {
  const {url} = req.params;  

  //verificar si existe el enlace
  const enlace = await Enlaces.findOne({url : req.params.url});

  if(!enlace){
    res.status(404).json({msg: "ese enlace no existe"});
    return next();
  }
  
  //si el archivo existe
  res.json({archivo: enlace.nombre, password: false});

  next();
}