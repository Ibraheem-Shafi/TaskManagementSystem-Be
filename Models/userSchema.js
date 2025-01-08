const mongoose = require('mongoose');

// Custom email validation function
const emailValidator = function(value) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value); // returns true if valid, false if invalid
};

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: emailValidator,
      message: 'Please provide a valid email address.',
    },
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const newToken = jwt.sign({ _id: this._id }, SECRET_KEY, { expiresIn: '1h' });
    this.token = this.token.concat({ token: newToken });
    await this.save();
    return newToken;
  } catch (error) {
    throw new Error(error);
  }
};

// User model is being exported like this to prevent the "OverwriteModelError" that occurs if you attempt to redefine a model with the same name in the same runtime.
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;