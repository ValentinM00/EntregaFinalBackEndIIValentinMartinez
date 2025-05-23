const User = require('../models/User');

class UserDAO {
    async findById(id) {
    return await User.findById(id);
}

    async findByEmail(email) {
    return await User.findOne({ email });
}

    async create(userData) {
    const user = new User(userData);
    return await user.save();
}

    async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
}

    async delete(id) {
    return await User.findByIdAndDelete(id);
}
}

module.exports = new UserDAO();