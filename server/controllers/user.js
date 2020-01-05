const mongoose = require('mongoose');
var _user = mongoose.model("User");
var _psaccount = mongoose.model("Psaccount");
var resource = require("../api/resource")


module.exports = {
    active: async (user, pass, id, callback) => {
        await _user.findOneAndUpdate(
            {username: user, password: pass},
            {$set: {discordId: id}},
            {new: true}, (err, data) => {
                if(err) {
                    callback({bool: false, msg: "Invalid password and user"})
                } else {
                    if(data === null){
                        callback({bool: false, msg: "Invalid username and password"})
                    }else {
                        callback({bool: true, msg: "Successfully Login"})
                    }
                }
            }
        )
    },

    login: async (id, channelName, callback) => { // callback attribe
        var clientBal;


        await _user.findOne({discordId: id}, (err, data) => {
            if(err) {
                // callback ({bool: false, msg: "All proxies are in use"})
                return {bool: false, msg: "All proxies are in use"}
            }
            else {
                clientBal = data.credit
            }
        })
        
        
        await _psaccount.findOne({discordId: null},
            async (err, acc) => {
            if(err) {
                callback ({bool: false, msg: "All proxies are in use"})
            }
            else {
                if(acc == null) {
                    callback ({bool: false, msg: "All proxies are in use"})
                } else {
                    var psbalance;
                    await resource.balance(acc.psAuth, result => {psbalance = result})
                    acc.discordId = id
                    acc.balance = psbalance
                    acc.channelName = channelName
                    acc.emptyBalance = psbalance - clientBal
                    acc.save( err => {
                        if(err) {
                            callback ({bool: false, msg: err})
                        }
                        callback ({bool: true})
                })
                }
                
            }
        })
        
    },

    logout: async (name, callback) => {
        await _psaccount.findOneAndUpdate({channelName: name},
            {discordId: null, emptyBalance: null, channelName: null},
            {new: true}, (err, data) => {
                if(err) {
                    callback ({bool: false})
                }
                else {
                    if(data === null) {
                        callback ({bool: false})
                    }
                    else {
                        callback ({bool: true})
                    }
                }
            }
        )
        
    },

    balance: async (name, callback) => {
        await _psaccount.findOne({channelName: name}, async (err, acc) => {
            if(err) {
                callback ( "error1 !balance: please create a ticket in ticket channel")
            }
            else{
                // console.log(acc)
                var psbalance;
                await resource.balance(acc.psAuth, result => {psbalance = result})
                acc.balance = psbalance
                acc.save( err => {
                    if(err) {
                        callback ("error2 !balance: please create a ticket in ticket channel")
                    }else {
                        let total = psbalance - acc.emptyBalance
                        callback (total)
                    }
                    
                })
            }
        })

    },

    changePassword: async (name, callback) => {
        await _psaccount.findOne({channelName: name}, 
            async (err, acc) => {
                if (err) {
                    callback ( "error1 !pass: please create a ticket in ticket channel")
                }
                else {
                    var psPassword;
                    await resource.changePassword(acc.psAuth, acc.psCsrf, result => {psPassword = result})
                    // console.log(psPassword);
                    acc.psPxPassword = psPassword
                    acc.save( err => {
                        if(err) {
                            callback ("error2 !balance: please create a ticket in ticket channel")
                        }else {
                            callback ("change")
                        }

                    })
                }

        })
    },


    list: async (name, callback) => {
        await _psaccount.findOne({channelName: name}, 
            async (err, acc) => {
                if (err) {
                    callback ( "error1 !list: please create a ticket in ticket channel")
                }
                else {
                    callback({pass: acc.psPxPassword, user: acc.psPxUsername})
                }

        })
    },



}