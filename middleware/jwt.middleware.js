const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = (req, res, next)=>{
    if(!req.headers['authorization']){
        return res.status(401).json({
            status: false,
            message: 'No Access Token sent.'
        });
    }

    try {

        const token = req.headers['authorization'].split(' ')[1];
        const {id, role} = jwt.verify(token, process.env.JWT_SEED);
        req.id = id;
        req.role = role;
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            status: false,
            message: 'Invalid Access Token.'
        });
    }
}




module.exports = {
    validateJWT
}