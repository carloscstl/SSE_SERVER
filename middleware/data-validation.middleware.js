const User = require("../models/user");
const path = require('path')


const validateAdmin = async (req, res, next) => {

    const role = req.role;

    try {
        const userRole = await UserRole.findById(role);

        if (userRole.role != 'ADMIN') {
            return res.status(403).json({
                status: false,
                message: "NOT ADMIN"
            })
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }
}




module.exports = {
    validateAdmin,
}