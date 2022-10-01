const User = require('../models/UserModel');
const QueryTool = require('../utils/queryTool');
const asyncHdler = require('../utils/asyncHdler');

// aliasing
exports.topRec = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-age';
  req.query.role = 'recruiter';

  next();
};
exports.getAllUser = asyncHdler(async (req, res, next) => {
  const queryTool = new QueryTool(User.find(), req.query)
    .filter()
    .sort()
    .paginate();
  const allUser = await queryTool.query;

  res.status(200).json({
    status: 'success',
    results: allUser.length,
    data: {
      data: allUser
    }
  });
});
exports.getUser = asyncHdler(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const savedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        savedUser
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
