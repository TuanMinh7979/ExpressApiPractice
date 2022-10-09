const User = require('../models/UserModel');
const QueryTool = require('../utils/queryTool');
const asyncHdler = require('../utils/asyncHdler');
const CustomErr = require('../utils/customErr');

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
exports.getUser = asyncHdler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    // bad
    // throw new CustomErr('No user found ', 404);
    // good
    next(new CustomErr('User not found', 404));
    return;
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// exports.createUser = asyncHdler(async (req, res) => {
//   const newUser = await User.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       user: newUser
//     }
//   });
// });

// exports.createUser = async (req, res) => {
//   try {
//     // const newTour = new Tour({})
//     // newTour.save()

//     const newUser = await User.create(req.body);

//     res.status(201).json({
//       status: 'success',
//       data: {
//         user: newUser
//       }
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };

//---------
exports.updateUser = asyncHdler(async (req, res, next) => {
  const savedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!savedUser) {
    next(new CustomErr('User not found', 404));
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      savedUser
    }
  });
});
exports.deleteUser = asyncHdler(async (req, res, next) => {
  const userToDel = await User.findByIdAndDelete(req.params.id);
  if (!userToDel) {
    next(new CustomErr('User not found', 404));
  }
  res.status(200).json({
    status: 'success'
  });
});
