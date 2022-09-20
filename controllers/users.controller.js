const UserRole = require("../models/user_role");
const User = require("../models/user");
const Profile = require("../models/profile");
const bcrypt = require('bcrypt');
const { response } = require("express");

const newRole = async (req, res) => {

    try {
        const role_name = req.body.role;
        const exists = await UserRole.findOne({ role: role_name.toUpperCase() });
        if (exists) {
            res.status(400).json({
                status: false,
                message: 'Role already exists.'
            });
        } else {
            const newUserRole = new UserRole(req.body);
            newUserRole.role = role_name.toUpperCase()
            await newUserRole.save();

            res.status(200).json({
                status: true,
                role: newUserRole
            })
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }

}

const newUser = async (req, res) => {

    try {
        const username = req.body.username;
        const exists = await User.findOne({ username });
        if (exists) {
            res.status(400).json({
                status: false,
                message: 'Username already exists.'
            });
        } else {

            const role = await UserRole.findOne({ role: req.body.role.toUpperCase() });
            if (!role) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid Role"
                });
            }

            req.body.role = role._id;

            console.log(req.body);

            const newUser = new User(req.body);
            newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync());

            await newUser.save();

            res.status(200).json({
                status: true,
                user: newUser
            })
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }

}


const newProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const exists = await Profile.findOne({ control: username });
        if (exists) {
            res.status(400).json({
                status: false,
                message: 'Profile already exists.'
            });
        } else {

            const newProfile = new Profile(req.body);
            newProfile.save();

            res.status(200).json({
                status: true,
                profile: newProfile
            })
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }

}

const newAlumnAccount = async (req, res) => {

    try {
        const { username } = req.body;
        const existingProfile = await Profile.findOne({ control: username });

        if (existingProfile) {
            res.status(400).json({
                status: false,
                message: 'Profile is already activated.'
            });
        } else {

            if (!existingProfile.nombre.includes(req.body.name.toUpperCase()) || (existingProfile.egreso.anio != req.body.egreso)) {

                console.log(existingProfile.nombre + " != " + req.body.name.toUpperCase() + " OR " + existingProfile.egreso.anio + "!=" + req.body.egreso)
                return res.status(400).json({
                    status: false,
                    message: 'Name or year does not match.'
                });
            }

            const existingAccount = await User.findOne({ username: username });
            if (existingAccount) {
                res.status(400).json({
                    status: false,
                    message: 'Profile is already activated.'
                });
            } else {

                const newUser = new User(req.body);
                newUser.profileActivated = true;
                newUser.name = existingProfile.nombre;





                //  profile.update(...profileData);
                //  profile.save();

                newUser.profile = existingProfile._id;
                newUser.save();

                res.status(200).json({
                    status: true,
                    username: username,
                    profile: newProfile
                });
            }


        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }

}



const getRoles = async (req, res) => {
    try {

        const roles = await UserRole.find();

        res.status(200).json({
            status: true,
            roles: roles
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }
}

const getUser = async (req, res) => {
    try {
        const { user } = req.params;
        console.log(user);
        const existingUser = await User.findOne({ username: user })
            .populate('role');
        if (existingUser) {
            console.log('EXISTS');
            res.status(200).json({
                status: true,
                user: existingUser
            });
        } else {
            console.log('DOES NOT EXIST');
            res.status(404).json({
                status: false,
                message: `User ${user} does not exist.`
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }
}

const getProfile = async (req, res) => {
    try {
        const { user } = req.params;
        console.log(user);
        const existingUser = await User.findOne({ username: user })
            .populate('role')
            .populate('profile');
        if (existingUser) {

            if (existingUser.profileActivated) {
                res.status(200).json({
                    status: true,
                    profile: existingUser.profile
                });
            } else {
                res.status(404).json({
                    status: false,
                    message: `Profile not activated.`
                })
            }

        } else {
            console.log('DOES NOT EXIST');
            res.status(404).json({
                status: false,
                message: `User ${user} does not exist.`
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }
}

const getUsersByRole = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;

        const { role } = req.params;

        const existingRole = await UserRole.findOne({ role: role.toUpperCase() });

        if (!existingRole) {
            res.status(400).json({
                status: false,
                message: 'Invalid Role.'
            });
        } else {

            const usersTotal = await User.find({ role: existingRole._id })

            const users = await User.find({ role: existingRole._id })
                .skip((page - 1) * 20)
                .limit(20);

            res.status(200).json({
                status: true,
                users: users,
                total: usersTotal.length
            });
        }




    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }
}

const updateProfile = async (req, res) => {
    //TODO: FIX!!!
    console.log('REQUEST: ' + req.body.id);
    const updatedProfile = req.body;

    const dbProfile = await Profile.findByIdAndUpdate(updatedProfile.id, { ...updateProfile });
    console.log('PROFILE FOUND: ' + dbProfile.id);

    if (dbProfile) {
        await dbProfile.save();
        return res.status(201).json({
            status: true,
            message: 'Profile updated'
        });
    }

    res.status(400).json({
        status: false,
        message: 'Profile not found'
    });

    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'SERVER ERROR'
        });
    }

}

module.exports = {
    newRole,
    newUser,
    newProfile,
    newAlumnAccount,

    getRoles,
    getUser,
    getProfile,
    getUsersByRole,

    updateProfile
}