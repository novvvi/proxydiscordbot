const mongoose = require('mongoose');
var _user = mongoose.model("User");
var _psaccount = mongoose.model("Psaccount");
var resource = require("../api/resource")


var _userFunction = {
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
                return {bool: false, msg: "msg1: Message ENVI Proxies Bot !active <user>@<pass> before login"}
            }
            else {
                if(data == null){
                    return {bool: false, msg: "msg2: Message ENVI Proxies Bot !active <user>@<pass> before login"}
                } else {
                    clientBal = data.credit
                }
                
            }
        })
        
        
        await _psaccount.findOne({discordId: null},
            async (err, acc) => {
            if(err) {
                callback ({bool: false, msg: "msg3: All proxies are in use"})
            }
            else {
                if(acc == null) {
                    callback ({bool: false, msg: "msg4: All proxies are in use"})
                }
                else if(clientBal == 0) {
                    callback ({bool: false, msg: "There is no GB left in your account"})
                } else {
                    var psbalance;
                    await resource.balance(acc.psAuth, result => {psbalance = result})
                    acc.discordId = id
                    acc.balance = psbalance
                    acc.channelName = channelName
                    acc.emptyBalance = psbalance - clientBal
                    acc.save( err => {
                        if(err) {
                            callback ({bool: false, msg: "Message ENVI Proxies Bot !active <user>@<pass> before login"})
                        }else {
                            callback ({bool: true})
                        }
                        
                    })
                }
                
            }
        })
        
    },

    logout: async (name, callback) => {
        await _psaccount.findOne({channelName: name}, async (err, acc) => {
                if(err) {
                    callback ({bool: false})
                }
                else {
                    if(acc === null) {
                        callback ({bool: false})
                    }
                    else {
                        var psPassword;
                        await resource.changePassword(acc.psAuth, acc.psCsrf, result => {psPassword = result})
                        await _userFunction.balance(name, bal => {console.log(`${name} logout and updated user balance with ${bal}`)});
                        // console.log(psPassword);
                        acc.psPxPassword = psPassword;
                        acc.discordId =  null;
                        acc.emptyBalance = null;
                        acc.channelName = null;
                        acc.save( err => {
                            if(err) {
                                callback ({bool: false})
                            }else {
                                callback ({bool: true})
                            }
                        })
                        
                    }
                }
            }
        )
        
    },

    userBalance: async(id, bal) => {
        await _user.findOneAndUpdate({discordId: id}, {$set: {credit: bal}},{new: true}, (err,acc) => {
            if (err) {
                console.log(err);
            } else {
                console.log(acc.credit)
            }
        })
    },


    balance: async (name, callback) => {
        await _psaccount.findOne({channelName: name}, async (err, acc) => {
            if(err) {
                callback ( "error1 !balance: please create a ticket in ticket channel")
            }
            else{
                // console.log(acc)
                var psbalance;
                await resource.balance(acc.psAuth, result => {psbalance = result});
                
                var subtract = psbalance - acc.emptyBalance
                var remainbalance =  Number(subtract.toFixed(2))
                await _userFunction.userBalance(acc.discordId, remainbalance);
                acc.balance = psbalance;
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


module.exports = _userFunction