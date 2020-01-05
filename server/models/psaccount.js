const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');



const PsaccountSchema = new mongoose.Schema({
    discordId: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: { discordId: { $type: 'string' } },
        }
    },
    
    balance: {
        type: Number,
        require: true,
    },
    emptyBalance: {
        type: Number,

    },
    psEmail: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: { psEmail: { $type: 'string' } },
        }
    },
    psPassword: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: { psPassword: { $type: 'string' } },
        }
    },
    psPxUsername: {
        type: String
    },
    psPxPassword: {
        type: String,
    },
    psAuth: {
        type: String
    },
    psCsrf: {
        type: String
    },
    channelName: {
        type: String
    }

},{timestamps: true});




PsaccountSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
mongoose.model('Psaccount', PsaccountSchema);