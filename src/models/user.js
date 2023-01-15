const mongose = require('mongoose');
const userSchema = mongose.Schema({
    user_name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlenght: 7,
        trim: true
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date()
    },
    deleted_at: {
        type: Date,
        required: false,
        default: null
    }
}, { versionKey: false })
const User = mongose.model('User', userSchema)
module.exports = User