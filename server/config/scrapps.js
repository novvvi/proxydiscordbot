const resource = require('../api/resource');
const mongoose = require('mongoose');
var _account = mongoose.model("Psaccount");


obj = {
    pstreams: (client) => {
        const getAllAccounts = () => {
            return _account.find({ discordId: { $ne: null } }).select({ "balance": 1, "psAuth": 1, "emptyBalance": 1, "_id": 1 })
        }

        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(()=> resolve(console.log("pass")), milliseconds))
        }

        const fetchingBal = (auth) => {
            return new Promise(resolve => {
                resource.balance(auth, bal => {
                    return resolve(bal)
                })
            })
        }

        const updateAcc = (id, currentBal, pastBal, emp) => {
            return new Promise(resolve => {
                _account.updateOne({ "_id": id }, { "$set": { "balance": currentBal } }, (err, data) => {
                    if (err) {
                        console.log("err")
                        resolve(console.log(err))
                    } else {
                        if(pastBal <= emp) {
                            var channel = client.guilds.get('656754615790075904')
                            .channels.find(chan => chan.name === i.channelName)
                            channel.delete();
                            console.log("finish1")
                            resolve(console.log(data))
                        } else {
                            console.log("finish2")
                            resolve(console.log(data))
                        }
                    }
                })
            })
        }

        var updateAllAccounts = (accs, sleep) => {
            const promise = accs.map(async acc => {
                // console.log(acc)
                await sleep;
                var pastBal = acc["balance"]
                var emp = acc["emptyBalance"]
                var id = acc["_id"]
                var auth = acc["psAuth"]
                var currentBal = await fetchingBal(auth)
                
                if (currentBal != null || pastBal != currentBal) {
                    console.log(currentBal)
                    await updateAcc(id, currentBal, pastBal, emp);
                }
            })

            return Promise.all(promise)
        }

        getAllAccounts()
        .then(async accs => {
            if(accs.length === 0) {
                console.log("no proxies in use")
                await sleep(100000);
                obj.pstreams(client)
            }else {
                await updateAllAccounts(accs, sleep(30000));
                console.log("finish check, will run again")
                obj.pstreams(client)
            }
            
        })

        

        
    },



    badexample: (client) => {
        // while (true){
            
            new Promise(resolve => {
                // done
                return resolve(_account.find({ discordId: { $ne: null } }).select({ "balance": 1, "psAuth": 1, "emptyBalance": 1, "_id": 1 }))
            }).then(accs => {
                accs.forEach(data => {
                    console.log(data)
                    return new Promise(resolve => setTimeout(() => resolve(data), 120000))
                    .then(data => {
                        
                        var currentBal = data["balance"]
                        var emp = data["emptyBalance"]
                        var id = data["_id"]
                        var auth = data["psAuth"]
                        var bal;
                        console.log("loading")
                        new Promise(resolve => {
                            resource.balance(auth, fetchbal => {
                                bal = resolve(fetchbal)
                                
                            })
                        })
                        console.log(bal)
                        new Promise(resolve => {
                            if (bal != null || currentBal != bal) {
                                if (bal <= emp) {
                                    resolve(_account.updateOne({ "_id": id }, { "$set": { "balance": bal } }, (err, data) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            var channel = client.guilds.get('656754615790075904')
                                                .channels.find(chan => chan.name === i.channelName)
                                            channel.delete();
                                        }
                                    }));
                                } else {
                                    resolve(_account.updateOne({ "_id": id }, { "$set": { "balance": bal } }, (err, data) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log(data)
                                        }
                                    }))
                                }
                            }
                        })
                    })
                });
            })
            
    }
}


module.exports = obj