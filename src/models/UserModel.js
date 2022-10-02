const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Name is not be empty'],
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    slug: String,
    password: {
      type: String,
      required: [true, 'Password is not be empty'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'passwordConfirm is not be empty'],
      validate: {
        // eslint-disable-next-line object-shorthand
        validator: function(val) {
          console.log('--------------', val, this.password);
          return val === this.password;
        },
        message: 'confirm password not match'
      }
    },

    role: {
      type: String,
      required: [true, 'Role is not be empty']
    },
    age: {
      type: Number,
      validate: {
        validator: val => val > 9,
        message: 'Age {{VALUE}} must be gt 9'
      }
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    state: {
      type: String,
      enum: {
        values: ['active', 'pendding'],
        message: 'missing state'
      }
    }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtual: true }
  }
);

userSchema.virtual('isLt20').get(function() {
  return this.age < 20;
});

userSchema.pre('save', async function(next) {
  this.slug = slugify(this.email, { lower: true });

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// after save middle ware
userSchema.post('save', function(document, next) {
  next();
});

// query middle ware
userSchema.pre('find', function(next) {
  // this now is query
  this.find({ role: { $ne: 'admin' } });
  next();
});

// eslint-disable-next-line func-names
userSchema.methods.checkLoginPassword = async function(inpPassword, realPass) {
  const rs = await bcrypt.compare(inpPassword, realPass);
  return rs;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
