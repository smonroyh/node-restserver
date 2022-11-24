const {Router}=require("express");
const { check } = require("express-validator");

const {login, googleSignIn}=require('../controllers/auth');
const { validarCampos } = require("../middlewares/validarCampos");

const router=Router();

router.post('/login', [
    check('correo','el correo es obligatorio').isEmail(),
    check('password','password es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/google', [
    check('id_token','el id_token es necesario').not().isEmpty(), 
    validarCampos
],googleSignIn );


module.exports = router;