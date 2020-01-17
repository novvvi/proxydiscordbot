const resource = require('../api/resource');
const mongoose = require('mongoose');
var _account = mongoose.model("Psaccount");
var User = mongoose.model("User");
var _resource = require('../api/resource')
var _user = require('../controllers/user')

obj = {
    pstreams: (client) => {
        const getAllAccounts = () => {
            return _account.find({ discordId: { $ne: null } }).select({ "channelName": 1,"balance": 1, "psAuth": 1, "emptyBalance": 1, "_id": 1 })
        }

        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds,'pass'))
        }

        var fetchingBal = (auth) => {
            return new Promise(resolve => {
                resource.balance(auth, bal => {
                    return resolve(bal)
                })
            })
        }

        var updateAcc = (id, currentBal, pastBal, emp) => {
            return new Promise(resolve => {
                _account.findOne({ "_id": id }, async (err, data) => {
                    if (err) {
                        console.log("err")
                        resolve(console.log(err))
                    } else {
                        if(pastBal <= emp) {
                            await _user.userBalance(data.discordId, 0);
                            await _resource.changePassword(data.psAuth, data.psCsrf, pw => {
                                if(typeof pw != null) {
                                    var channel = client.guilds.get('656754615790075904').channels.find(chan => chan.name === data.channelName)
                                    channel.delete();
                                    data.balance = currentBal;
                                    data.psPxPassword = pw;
                                    data.channelName = null;
                                    data.discordId = null;
                                    data.save( err => {
                                        if(err) {
                                            console.log(err)
                                        }else {
                                            resolve(console.log(`it is done for user`))
                                        }
                                        
                                    })
                                    
                                }else {
                                    resolve(console.log(`${data.channelName} fail to change password, and save`))
                                }
                            })
                        } else {
                            let subtract = currentBal - emp;
                            var newBal =  Number(subtract.toFixed(2))
                            data.balance = currentBal;
                            data.save( err => {
                                if(err) {
                                    console.log(err)
                                }else {
                                    resolve(console.log(`updated user and account balance`))
                                }
                                
                            })
                            await _user.userBalance(data.discordId, newBal);
                            resolve(console.log(`${data.channelName} still have balance left`))
                        }
                    }
                })
            })
        }

        async function updateAllAccounts(accs)  {
            
            // using mapping or forEach will wait for all tasks to complete before it loop again


            // const promise = accs.map(async (acc) => {
            //     // console.log(acc)
                

            for(i = 0; i < accs.length; i++) {
                await sleep(10000);
                var acc = accs[i]
                var pastBal = acc["balance"]
                var emp = acc["emptyBalance"]
                var id = acc["_id"]
                var auth = acc["psAuth"]
                var chan = acc["channelName"]
                var currentBal = await fetchingBal(auth)
                if (currentBal != null || pastBal != currentBal) {
                    await updateAcc(id, currentBal, pastBal, emp);
                    console.log(`${id} - ${chan} balance ${currentBal}\n`)
                }
            }
                
                // return  Promise.all(
                //     [
                //         sleep,
                //         async function runthis() {
                //             var pastBal = acc["balance"]
                //             var emp = acc["emptyBalance"]
                //             var id = acc["_id"]
                //             var auth = acc["psAuth"]
                //             var chan = acc.channelName
                //             var currentBal = await fetchingBal(auth)
                //             if (currentBal != null || pastBal != currentBal) {
                //                 await updateAcc(id, currentBal, pastBal, emp);
                //                 console.log(`${id} - ${chan} balance ${currentBal}`)
                //             }
                                
                //         }
                //     ]
                // ).then(values => { console.log(values)})
            // });
            // return Promise.all(promise)
        }

        getAllAccounts()
        .then(async accs => {
            if(accs.length === 0) {
                console.log("no proxies in use")
                await sleep(60000);
                obj.pstreams(client)
            }else {
                await updateAllAccounts(accs);
                console.log("finish check, will run again")
                obj.pstreams(client)
            }
            
        })

        

        
    },



    // badexample: (client) => {
    //     // while (true){
            
    //         new Promise(resolve => {
    //             // done
    //             return resolve(_account.find({ discordId: { $ne: null } }).select({ "balance": 1, "psAuth": 1, "emptyBalance": 1, "_id": 1 }))
    //         }).then(accs => {
    //             accs.forEach(data => {
    //                 console.log(data)
    //                 return new Promise(resolve => setTimeout(() => resolve(data), 120000))
    //                 .then(data => {
                        
    //                     var currentBal = data["balance"]
    //                     var emp = data["emptyBalance"]
    //                     var id = data["_id"]
    //                     var auth = data["psAuth"]
    //                     var bal;
    //                     console.log("loading")
    //                     new Promise(resolve => {
    //                         resource.balance(auth, fetchbal => {
    //                             bal = resolve(fetchbal)
                                
    //                         })
    //                     })
    //                     console.log(bal)
    //                     new Promise(resolve => {
    //                         if (bal != null || currentBal != bal) {
    //                             if (bal <= emp) {
    //                                 resolve(_account.updateOne({ "_id": id }, { "$set": { "balance": bal } }, (err, data) => {
    //                                     if (err) {
    //                                         console.log(err)
    //                                     } else {
    //                                         var channel = client.guilds.get('656754615790075904')
    //                                             .channels.find(chan => chan.name === i.channelName)
    //                                         channel.delete();
    //                                     }
    //                                 }));
    //                             } else {
    //                                 resolve(_account.updateOne({ "_id": id }, { "$set": { "balance": bal } }, (err, data) => {
    //                                     if (err) {
    //                                         console.log(err)
    //                                     } else {
    //                                         console.log(data)
    //                                     }
    //                                 }))
    //                             }
    //                         }
    //                     })
    //                 })
    //             });
    //         })
            
    // }
}


module.exports = obj