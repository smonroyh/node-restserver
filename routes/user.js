const {Router}=require("express");
const { check } = require("express-validator");

const { esRoleValido, existeEmail, existeUsuarioById } = require("../helpers/dbValidators");

const { validarCampos } = require("../middlewares/validarCampos");

const { usuariosGet, 
        usuariosPost,
        usuariosPut,
        usuariosDelete,
        usuariosPatch } = require("../controllers/user");

const router=Router();

router.get('/', usuariosGet)

router.post('/',[
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('password','El password debe ser más de 6 letras').isLength({min:6}),
        check('correo','El correo no es valido').isEmail(),
        check('correo').custom((correo)=>existeEmail(correo)),
        // check('role','no es un rol permitido').isIn(["ADMIN_ROLE","USER_ROLE"]),
        check('role').custom(rol=>esRoleValido(rol)),
        validarCampos
        
], usuariosPost) 

router.put('/:id',[
        check('id',"No es un ID valido").isMongoId(),
        check('id').custom((id)=>existeUsuarioById(id)),
        check('role').custom(rol=>esRoleValido(rol)),
        validarCampos
], usuariosPut)

router.patch('/', usuariosPatch)

router.delete('/:id',[
        check('id',"El id no es valido").isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos,
] ,usuariosDelete)





module.exports = router;