const { request, response } = require("express")
const jwt=require('jsonwebtoken');

const esAdminRole=(req=request,res=response,next)=>{

    if(!req.usuario){
        return res.status(500).json({
            msg:"se quiere verificar el rol sin validar el token primero"
        })
    }

    if(req.usuario.role!="ADMIN_ROLE"){
        return res.status(401).json({
            msg: `el usuario ${req.usuario.nombre} No es un admin`
        })
    }
    next();
}

const tieneRol=(...roles)=>{
    return (req=request,res=response,next)=>{
        if(!req.usuario){
            return res.status(500).json({
                msg:"se quiere verificar el rol sin validar el token primero"
            })
        }

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg: `el usuario ${req.usuario.nombre} requiere uno de estos roles ${roles}`
            })
        }


        next();
    }
}

module.exports={
    esAdminRole,
    tieneRol
}