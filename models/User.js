const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: { type: String, require: true, trim: true },
    userName: { type: String, require: true, trim: true, unique: true},
    email   : { type: String, require: true, trim: true, unique: true},
    phone   : { type: String, trim: true, unique: true },
    password: { type: String, require: true},
    /**
     * 1 : hoat dong
     * 0 : da khoa
     * -1: cho xac nhan mail
     */
    status  : { type: Number, default: -1},
    /**
     * 1 : Admin
     * -1: user
     */
    role: {type: Number, default: -1 }

})
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;