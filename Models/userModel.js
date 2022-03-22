const mongoose = require("mongoose");
const schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const userModelSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    houseName: {
        type: String
    },
    place: {
        type: String
    },
    pincode: {
        type: String
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    },
    password:{
        type:String
    }
})
module.exports = mongoose.model("userModel", userModelSchema);