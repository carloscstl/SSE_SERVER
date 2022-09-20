const {Router} = require('express');
const {check} = require('express-validator');
const { getEventsByType, newEvent, deactivateEvent, updateEvent, getEvent } = require('../controllers/events.controller');
const { validateAdmin } = require('../middleware/data-validation.middleware');
const { validateJWT } = require('../middleware/jwt.middleware');

const router = Router();

router.post('/create', [
    check('type', 'Type required.').not().isEmpty(),
    check('title', 'Title required.').not().isEmpty(),
//    validateJWT,
//    validateAdmin
],newEvent);

router.get('/all/:type', [
  //  validateJWT,
 //   validateAdmin
],getEventsByType);

router.put('/delete/:id', [
    validateJWT,
    validateAdmin
],deactivateEvent);

router.put('/update/:id', [
    validateJWT,
    validateAdmin
],updateEvent);

router.get('/:id', getEvent);


module.exports = router;