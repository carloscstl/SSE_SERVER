const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middleware/validate-fields.middleware');

const { newRole, getRoles, newUser, newProfile, newAlumnAccount, getUser, getProfile, getUsersByRole, updateProfile, getProfileImg } = require('../controllers/users.controller');
const { validateAdmin } = require('../middleware/data-validation.middleware');
const { validateJWT } = require('../middleware/jwt.middleware');

const router = Router();

router.post('/role', [
    check('role', 'Role name required.').not().isEmpty(),
    check('permissions', 'Permissions list required.').not().isEmpty(),
    validateFields
], newRole);

router.get('/roles', getRoles);

router.post('/register', [
    check('name', 'Name required.').not().isEmpty(),
    check('username', 'Username required.').not().isEmpty(),
    check('password', 'Password required.').not().isEmpty(),
    validateFields,
    validateJWT,
    validateAdmin
], newUser);

router.post('/profile', newProfile);

router.post('/activate', [
    check('username', 'Username required.').not().isEmpty(),
    validateFields
], newAlumnAccount);



router.get('/profile/:user', getProfile);

router.get('/:user', getUser);

router.get('/role/:role', getUsersByRole);

router.put('/profile/:id', [
    check('id', 'Id required.').not().isEmpty(),
], updateProfile);

module.exports = router;