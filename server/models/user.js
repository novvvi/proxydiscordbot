const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const psaccountSchema = require("./psaccount")
const transactionSchema = require("./transaction")

const UserSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "client",
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    discordId: {
        type: String,
        default: null
    },
    credit: {
        type: Number,
        require: true,
        default: 0,
        min: 0
    },
    transactions: [transactionSchema],
    psaccount: psaccountSchema

},{timestamps: true});




UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
mongoose.model('User', UserSchema);