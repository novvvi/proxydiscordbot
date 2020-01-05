const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');


const transactionSchema = new mongoose.Schema({
    issue: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    record: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    credit: {
        type: Number,
        require: true,
        default: 0,
        min: 0
    }

},{timestamps: true});




transactionSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
mongoose.model('Transaction', transactionSchema);