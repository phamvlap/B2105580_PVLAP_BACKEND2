const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserService = require('./../services/user.service');
const MongoDB = require('./../utils/mongodb.util');
const ApiError = require('./../api-error');

const JWT_SECRET = process.env.JWT_SECRET;

// register new user
exports.register = async (req, res, next) => {
    if(!req.body?.name || !req.body?.email || !req.body?.password) {
        return next(new ApiError(400, 'Name, email and password cannot be empty'));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.create(req.body);
        return res.json({ data: { user } });
    }
    catch(error) {
        return next(new ApiError(500, 'An error occured while creating the user'));
    }
};

// login user
exports.login = async (req, res, next) => {
    const data = req.body;
    if(typeof data.email != 'string' || typeof data.password != 'string') {
        return next(new ApiError(404, 'Email or password invalid'));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findByEmail({ email: data.email });
        if(!user) {
            return next(new ApiError(404, 'Email or password invalid'));
        }
        const isMatch = bcrypt.compareSync(data.password, user.password);
        if(!isMatch) {
            return next(new ApiError(404, 'Email or password invalid'));
        }
        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
        }, JWT_SECRET, { expiresIn: '2 days' });
        return res.json({
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                expiresIn: 3600,
                token
            }
        })
    }
    catch(error) {
        return next(new ApiError(500, 'An error occured while retrieving the user'));
    }
};
