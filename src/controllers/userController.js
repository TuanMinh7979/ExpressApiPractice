const User = require('../models/UserModel');

exports.getAllUser = async (req, res) => {
  try {
    // EXECUTE QUERY
    const allUser = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: allUser.length,
      data: {
        ok: 'asjdfnasf',
        data: allUser
      }
    });
  } catch (err) {
    console.log('------------', err);
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
