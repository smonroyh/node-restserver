const {req, json}=require('express');
const Usuario = require('../models/usuario');
const bcryptjs=require('bcryptjs');
const generarJWT = require('../helpers/generarJWT');
const login=async(req,res)=>{

    const {correo,password}=req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg:`usuario ${correo} / password incorrectos - correo`
            })
        }
        //Si el usuario esta activo (estado : true)
        if(usuario.estado==false){
            return res.status(400).json({
                msg:`usuario ${correo} / password incorrectos - estado: false`
            })
        }
        //verificar la contraseña
        validPassword= bcryptjs.compareSync(password,usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg:`usuario ${correo} / password incorrectos - password incorrect`
            })
        }
        //generar el JWT
        const token=await generarJWT(usuario.id)


        res.json({
            msg:"login",
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:"Hable con el administrador"
        })
    }
  
}

module.exports ={login}