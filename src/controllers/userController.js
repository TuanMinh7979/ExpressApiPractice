const User = require('../models/UserModel');

class GetApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  buildQuery(){
    const queryObj = { ...this.queryString };
    const removeField = ['page', 'sort', 'limit', 'fields'];
    removeField.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));

    this.query.find(JSON.parse(queryStr))
  }
}

// aliasing
exports.topRec = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-age';
  req.query.role = 'recruiter';

  next();
};
exports.getAllUser = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const removeField = ['page', 'sort', 'limit', 'fields'];
    removeField.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = User.find(JSON.parse(queryStr));

    if (req.query.sort) {
      query = query.sort(req.query.sort);
    } else {
      // query = query.sort('-createdAt');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination

    const page = req.query.page * 1 || 1;
    const limitNum = req.query.limit * 1 || 10;
    const skipNum = (page - 1) * limitNum;

    console.log(skipNum, limitNum);
    query = query.skip(skipNum).limit(limitNum);

    if (req.query.page) {
      const dataSize = await User.countDocuments();
      if (skipNum >= dataSize) throw new Error('This page does not exist');
    }

    const allUser = await query;

    res.status(200).json({
      status: 'success',
      results: allUser.length,
      data: {
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
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
exports.createUser = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newUser
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
