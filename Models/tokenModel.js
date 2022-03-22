var mongoose = require('mongoose');
var TokenSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId, ref: 'userModel'
    },
    tokenvalue: {
        type: String
    },
    role: {
        type: String
    },
    role: {
        type: String, default: 'User'
    },
    status: {
        type: String,
        default: 'Active' //loggedout
    },
    createddate: { type: Date, default: Date.now, expires: 31536000 }
});


module.exports = mongoose.model('TokenModel', TokenSchema);    