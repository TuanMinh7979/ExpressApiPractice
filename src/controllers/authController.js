const User = require('../models/UserModel');
const QueryTool = require('../utils/queryTool');
const asyncHdler = require('../utils/asyncHdler');
const CustomErr = require('../utils/customErr');

exports.signup = asyncHdler(async (req, res) => {
  console.log(req.body);
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      message: 'Sign up success',
      user: newUser
    }
  });
});
