const Role=require("../models/role");
const Usuario = require("../models/usuario");

const esRoleValido=async(rol="")=>{
    const existRole=await Role.findOne({role:rol});
    if(!existRole){
            throw new Error(`el rol ${rol} no está en la BD`);
    }
}

const existeEmail=async(email="")=>{
    const existeEmail= await Usuario.findOne({correo:email});

    if(existeEmail){
        throw new Error(`El email ${email} está repetido`)
    }
}

const existeUsuarioById=async(_id="")=>{
    const existeId= await Usuario.findById(_id);

    if(!existeId){
        throw new Error(`El usuario con el id ${_id} no está en la base de datos`)
    }
}

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioById
}