const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const QueryTool = require('../utils/QueryTool');
const asyncHdler = require('../utils/asyncHdler');
const CustomErr = require('../utils/customErr');

const createToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
exports.signup = asyncHdler(async (req, res) => {
  console.log(req.body);
  const newUser = await User.create(req.body);

  // eslint-disable-next-line no-underscore-dangle
  const token = createToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      message: 'Sign up success',
      user: newUser
    }
  });
});

exports.login = asyncHdler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new CustomErr('Please provide email and password', 400));
    return;
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    next(new CustomErr('Incorrect email or password'));
    return;
  }

  const correct = await user.checkLoginPassword(password, user.password);

  if (!correct) {
    next(new CustomErr('Incorrect email or password'));
    return;
  }
  // eslint-disable-next-line no-underscore-dangle
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = asyncHdler(async (req, res, next) => {
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }

  if (!token) {
    next(new CustomErr('Login before', 401));
    return;
  }

  console.log('-----------before-----------');
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('-----------after-----------');

  // check if user exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    next(new CustomErr('the user of this token is no longer exist'));
    return;
  }
  next();
});
