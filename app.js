const express = require('express');
const morgan = require('morgan');
const userRoute = require('./src/routes/userRouter');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Route
app.use('/api/v1/user', userRoute);

module.exports = app;
