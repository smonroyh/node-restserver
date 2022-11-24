const {req, json, response}=require('express');
const Usuario = require('../models/usuario');
const bcryptjs=require('bcryptjs');
const generarJWT = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/googleVerify');


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


const googleSignIn=async(req=request,res=response)=>{
    const {id_token}=req.body;

    try {
        const {correo, img, nombre}=await googleVerify(id_token)

        let usuario=await Usuario.findOne({correo})

        if(!usuario){
            const data={
                nombre,
                correo,
                password:':P',
                img,
                google:true
            }
            usuario=new Usuario(data)
            await usuario.save()
        }
        if(!usuario.estado){
            return res.status(401).json({
                msg:"Hable con el administrador - usuario bloqueado"
            })
        }

        //generar el JWT
        const token=await generarJWT(usuario.id)

        // console.log(googleUser)
        res.json({
            msg:"Todo ok google sign in",
            usuario,
            token
            // id_token
        })
    } catch (error) {
        res.status(400).json({
            msg:'Token de google no es valido'
        })
    }
    
}

module.exports ={login,
    googleSignIn}