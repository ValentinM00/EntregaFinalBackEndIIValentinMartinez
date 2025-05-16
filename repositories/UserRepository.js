const UserDAO = require('../dao/UserDAO');
const UserDTO = require('../dtos/UserDTO');

class UserRepository {
    async getUserDTOById(id) {
    const user = await UserDAO.findById(id);
    if (!user) throw new Error('User not found');
    return new UserDTO(user);
}
}

module.exports = new UserRepository();