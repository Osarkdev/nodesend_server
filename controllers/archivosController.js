const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {

        limits : {fileSize: req.usuario ? 1024*1024*10 : 1024*1024},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async (error) => {
        console.log(req.file);
        if(!error){
            res.json({
                archivo: req.file.filename
            });
        } else {
            console.log(error);
            return next();
        }
    });
}

exports.eliminarArchivo = async (req, res) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.log('archivo eliminado');
    } catch (error) {
        console.log(error);
    }
}

exports.descargarArchivo = async (req, res) => {

    const {archivo} = req.params;
    const enlace = await Enlaces.findOne({nombre: archivo})


    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    //si las descargas son iguales a 1 - Borrar entrada y borrar el archivo
  const {descargas, nombre} = enlace;

  if(descargas === 1){
    console.log('es solo 1');

    //Eliminar el archivo
    req.archivo = nombre;

    //eliminar la entrada a la base de datos
    await Enlaces.findOneAndDelete(enlace.id);
    next();

  } else {
    //si las descargas son > 1 - Restar 1
    enlace.descargas--;
    await enlace.save();
  }
}