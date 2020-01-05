const mongoose = require('mongoose');
var _user = mongoose.model("User");
var _psaccount = mongoose.model("Psaccount");

module.exports = {
    users: async (callback) => {
        await _user.find({}, (err, data)=> {
            if(err) {
                callback({msg: err})
            }
            else {
                callback({msg: data})
            }
        })
    },
    createUser: async (data, callback) => {
        await _user.create(data, (err, data) => {
            if(err) {
                console.log(err)
                callback({msg: err})
            }
            else {
                console.log(data)
                callback({msg: "Users has added to database"})
            }
        })
    },

    proxies: async (callback) => {
        await _psaccount.find({}, (err, data)=> {
            if(err) {
                callback({msg: err})
            }
            else {
                callback({msg: data})
            }
        })
    },

    addProxies: async (data, callback) => {
        await _psaccount.create(data, (err, data) => {
            if(err) {
                callback({msg: err})
            }
            else {
                console.log(data)
                callback({msg: "proxies has added to database"})
            }
        })
    }
}