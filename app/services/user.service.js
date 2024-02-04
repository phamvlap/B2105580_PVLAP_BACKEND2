const bcrypt = require('bcryptjs');

class UserService {
    constructor(client) {
        this.User = client.db('contactbook').collection('users');
    }

    // filter data
    filteUserData(payload) {
        const user = {
            name: payload.name,
            email: payload.email,
            password: payload.password,
        };
        Object.keys(user).forEach(key => {
            if(user[key] === undefined) {
                delete user[key];
            }
        });
        return user;
    }

    // create new user
    async create(payload) {
        const user = this.filteUserData(payload);
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(user.password, salt);
        user.password = hashPassword;
        const result = await this.User.findOneAndUpdate(
            {
                name: user.name,
                email: user.email,
            },
            { $set: user },
            {
                returnDocument: 'after',
                upsert: true,
            }
        );
        return {
            name: result.name,
            email: result.email,
        };
    }

    // find an user with email
    async findByEmail(filter) {
        return await this.User.findOne({
            email: filter.email,
        });
    }
}

module.exports = UserService;
