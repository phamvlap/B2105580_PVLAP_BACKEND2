require('dotenv').config();
const jwt = require('jsonwebtoken');
const ApiError = require('./../api-error');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if(!token) {
        return next(new ApiError(400, 'Missing token'));
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            _id: decoded._id,
            name: decoded.name,
            email: decoded.email,
        }
        return next();
    }
    catch(error) {
        return next(new ApiError(400, 'Invalid token'));
    }
}
