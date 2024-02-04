const express = require('express');
const cors = require('cors');

const contactsRouter = require('./app/routes/contact.route');
const authRouter = require('./app/routes/auth.route');
const ApiError = require('./app/api-error');
const authentication = require('./app/middlewares/authentication');

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRouter);
app.use('/api/contacts', authentication, contactsRouter);

// handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, 'Resource not found'));
});

// define error-handling middleware last
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Sever Error',
    });
});

module.exports = app;
