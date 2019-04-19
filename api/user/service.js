const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('middlewares/db');
const User = db.User;


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        const { password, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: "Bearer:" +user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll(){
    return await User.find({}).select('-password');
}

async function getById(id){
    return await User.findById(id).select('-password');
}

async function create(body){
    if (await User.findOne({ email: body.email })) {
        throw 'User with "' + body.email + '" already exists.';
    }
    var user = new User(body);
    user.password = bcrypt.hashSync(body.password, 10)
    await user.save();
}

async function update(id, body){
    var user = await User.findById(id);
    
    if(!user)
        throw 'User not found';
    else if(user.email !== body.email && await User.findOne({ email: body.email }))
        throw 'Email already exists in our database.';
    
    if(body.password){
        bcrypt.hashSync(body.password,10);
    }

    Object.assign(user, body);
    await user.save();

}

async function _delete(id){
    return await User.findByIdAndRemove(id);
}

