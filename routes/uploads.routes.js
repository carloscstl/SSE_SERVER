
const { Router } = require('express');
const { check } = require('express-validator');
const { uploadImage, showImage } = require('../controllers/uploads.controller');
const { validateImage } = require('../middleware/data-validation.middleware');
const { validateFields } = require('../middleware/validate-fields.middleware');

const router = Router();

router.post('/:coleccion/:id', uploadImage);

router.get('/users/:id',[
    check('id','El id debe de ser de mongo').isMongoId(),
    validateFields
],showImage);

module.exports = router;