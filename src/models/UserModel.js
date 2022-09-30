const mongoose = require('mongoose');
const slugify = require('slugify');
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Name is not be empty']
    },
    slug: String,
    password: {
      type: String,
      required: [true, 'Password is not be empty']
    },
    role: {
      type: String,
      required: [true, 'Role is not be empty']
    },
    age: {
      type: Number
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
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

userSchema.pre('save', function(next) {
  //run after controller
  this.slug = slugify(this.email, { lower: true });
  console.log('-----mongo middleware-----', this);
  next();
});

//after save middle ware
userSchema.post('save', function(document, next) {
  console.log('after saved doc : ', document);
  next();
});

//query middle ware
userSchema.pre('find', function(next) {
  //this now is query
  this.find({ role: { $ne: 'admin' } });
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
