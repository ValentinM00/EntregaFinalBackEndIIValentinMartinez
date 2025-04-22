const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    age: Number,
    role: String,
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === candidatePassword; // En producción usa bcrypt
};

module.exports = mongoose.model('User', userSchema);