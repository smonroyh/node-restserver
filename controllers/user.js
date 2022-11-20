const {response,request} =require('express');
const bcryptjs=require('bcryptjs')

const Usuario=require('../models/usuario');
const {existeEmail}=require('../helpers/dbValidators');





const usuariosGet=async(req=request, res=response)=> {
    // const {q,nombre,page=2,limit}=req.query;
    const {limite=5, desde=0}=req.query;
    const query={estado:true};

    // const usuarios=await Usuario.find({estado:true})
    //     .skip(desde)
    //     .limit(limite)

    // const total=await Usuario.countDocuments();

    const [total,usuarios]=await Promise.all([
        Usuario.countDocuments(query),

        Usuario.find(query)
        .skip(desde)
        .limit(limite),
        ]    
    )
    res.json({
        msg:"get API - controlador",
        total,
        usuarios
    })
}

const usuariosPost=async(req, res=response)=> {

    const {nombre,correo,password,role}=req.body;
    const usuario=new Usuario({nombre,correo,password,role});

    //hacer el hash de la contraseña
    const salt=bcryptjs.genSaltSync();
    usuario.password=bcryptjs.hashSync(password,salt);

    //guardar en la BD
    await usuario.save();

    res.status(201).json({
        msg:"post API - controlador",
        usuario
    })
}

const usuariosPut=async(req, res=response)=> {
    const {id}=req.params;
    const {_id,password, google, correo, ...resto}=req.body;

    //TODO VALIDAR CONTRA BD
    if(password){
        //hacer el hash de la contraseña
        const salt=bcryptjs.genSaltSync();
        resto.password=bcryptjs.hashSync(password,salt);
    }

    const usuario= await Usuario.findByIdAndUpdate(id,resto)

    res.json({
        msg:"put API - controlador",
        usuario
    })
}

const usuariosPatch=(req,res=response)=>{
    res.json({
        msg:"patch API - controlador"
    })
}

const usuariosDelete=async(req, res=response)=> {
    const {id}=req.params;

    //req.usuario es enviado desde el middleware validarJWT 
    // const usuarioAutenticado=req.usuario;

    //fisicamente se borra
    // const usuario=await Usuario.findByIdAndDelete(id);
    const usuario=await Usuario.findByIdAndUpdate(id,{estado:false});
    res.json({
        msg:"delete API - controlador",
        usuario,
        // usuarioAutenticado
    })
}


module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch, 
    usuariosDelete,
}