const {Router}=require("express");
const { check } = require("express-validator");

const {login}=require('../controllers/auth');
const { validarCampos } = require("../middlewares/validarCampos");

const router=Router();

router.post('/login', [
    check('correo','el correo es obligatorio').isEmail(),
    check('password','password es obligatoria').not().isEmpty(),
    validarCampos
],login );


module.exports = router;