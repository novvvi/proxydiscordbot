const discord = require('discord.js')
require('dotenv').config()
require('./server/config/mongoose');
const _user = require('./server/controllers/user')
const _admin = require('./server/controllers/admin')
const _list = require('./server/config/genlist')
const _scrap = require('./server/config/scrapps')
var path = require('path');
var appDir = path.dirname(require.main.filename);
const fs = require('fs');
const embed = require('./embed/message')
const prefix = "!"


const client = new discord.Client({
    disableEveryone: true
});

client.on('ready', () => {
    console.log(`Bot Name: ${client.user.username}`)
    
    
    _scrap.pstreams(client)
    

    client.user.setPresence({
        status: "online",
        game: {
            name: "your Command",
            type: 2
        }
    })

})

client.on('message', async msg => {
    var server = msg.guild;
    var author = msg.author;
    var cmd = msg.content;


    if (msg.author.bot) return;




    // if (blockList.includes(msg.author.id)) return;
    if (msg.channel.type === "dm") {
        // if (msg.author.id not in database) block user;
        if (cmd.startsWith(`${prefix}active `)) {
            let userpass = cmd.slice(8, cmd.length);
            if (/[\@]/.test(userpass)) {
                let username = userpass.match(/^[^@]+/)[0]
                let password = userpass.replace(username + "@", '')
                ///check username and password
                console.log(username)
                console.log(password)
                console.log(msg.channel.recipient.id)
                var activeResponse;
                await _user.active(username, password, msg.channel.recipient.id,
                    (data) => {
                        activeResponse = data;
                    })
                console.log(activeResponse)
                if (activeResponse.bool) {
                    // let role = msg.guild.roles.find(role => role.name === "Active Acccount");
                    author.sendMessage(activeResponse.msg)
                    // console.log(server.channels)

                } else {
                    author.sendMessage(activeResponse.msg)
                }
            }
        }
    }
    if (msg.channel.name === "add-proxies") {

        if (cmd.startsWith("!add\n")) {
            var proxiesData = []
            var proxiesInfo = cmd.replace("!add\n", "").split("\n")
            proxiesInfo.forEach(user => {
                if (user.includes(undefined) || user.includes("")) {
                    var proxiesInfo = user.split(' ')
                    var map = {
                        psEmail: proxiesInfo[0],
                        psPassword: proxiesInfo[1],
                        psPxUsername: proxiesInfo[2],
                        psPxPassword: proxiesInfo[3],
                        psAuth: proxiesInfo[4],
                        psCsrf: proxiesInfo[5]
                    }
                    proxiesData.push(map);
                }
            })
            console.log(proxiesData)
            await _admin.addProxies(proxiesData, (data) => {
                msg.channel.sendMessage(data.msg);
            })

        }

        if (cmd === "!proxies") {
            await _admin.proxies((data) => {
                console.log(data)
                msg.channel.sendMessage(String(data.msg))
            })
        }
    }

    if (msg.channel.name === "create-user") {

        if (cmd.startsWith("!create\n")) {
            var usersData = []
            var usersInfo = cmd.replace("!create\n", "").split("\n")
            usersInfo.forEach(user => {
                if (user.includes(undefined) || user.includes("")) {
                    var userInfo = user.split('    ')
                    var map = {
                        email: userInfo[0],
                        username: userInfo[1],
                        password: userInfo[2],
                        credit: userInfo[3]
                    }
                    usersData.push(map);
                }
            })
            console.log(usersData)
            await _admin.createUser(usersData, async (data) => {
                await msg.channel.sendMessage(data.msg);
            })

        }

        if (cmd === "!users") {
            var res;
            await _admin.users((data) => {
                res = data
            })
            msg.channel.sendMessage(String(res.msg))

        }
    }


    // msg.author.id && 
    if (msg.channel.name === "login") {
        var permsName = "terminal-" + author.username;
        //656838939772059649'
        var matchchan = server.channels.find(chan => chan.permissionOverwrites.has(author.id))
        if (matchchan !== null) {
            msg.delete();
            return msg.channel.sendMessage(`already Login: ${author.username} please check your Channel under "COMMAND" Calogary`)
        }
        else if (cmd === `${prefix}login`) {
            // need verify user!!
            // console.log(server.channels)
            msg.delete();
            
            await _user.login(author.id, permsName, data => {
                if (data.bool) {
                    server.createChannel(permsName, 'text').then( // Create the actual voice channel.
                        (chan) => {
                            // console.log(server.channels.get("656838939772059649"))
                            chan.setParent("656760744078999563").then( // Move the voice channel to the current message's parent category.
                                (chan2) => {
                                    chan2.replacePermissionOverwrites({
                                        overwrites: [
                                            {
                                                id: "656754615790075904", //everyone
                                                deny: ['VIEW_CHANNEL'],
                                            },
                                            {
                                                id: "656756534075719700", //admin
                                                allow: ['VIEW_CHANNEL'],
                                            },
                                            {
                                                id: "656766959094071306", //bot
                                                allow: ['VIEW_CHANNEL'],
                                            },
                                            {
                                                id: author.id, //Ac
                                                allow: ['VIEW_CHANNEL'],
                                            },
                                        ],
                                    });
                                }
                            )
                            chan.send(embed.commands);
                        })
                    msg.delete();
                    msg.channel.sendMessage(`Login Success: ${author.username}`)
                }
                else {
                    msg.channel.sendMessage(data.msg);
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    if (msg.channel.name.startsWith("terminal-")) {
        if (cmd === "!balance") {
            msg.delete()
            await _user.balance(msg.channel.name, data => {
                if (typeof data === 'number') {
                    return msg.channel.sendMessage(`remain GB: ${data.toFixed(2)}`)
                } else {
                    return msg.channel.sendMessage(data)
                }
            })

        }
        else if (cmd === "!logout") {
            await _user.logout(msg.channel.name, (data) => {
                console.log(data.bool);
                if (data.bool) return msg.channel.delete();
            })
        }
        else if (cmd === "!pass") {
            msg.delete()
            await _user.changePassword(msg.channel.name, data => {
                if (data === 'change') {
                    msg.channel.sendMessage("Your password has changed\nplease redownload your list")
                }
            })
        }
        else if (cmd.startsWith("!gen ")) {
            await _user.list(msg.channel.name, async data => {
                if (typeof data === "string") {
                    msg.delete()
                    msg.channel.sendMessage("Your password has changed")
                } else {
                    var arr = cmd.slice(5, cmd.length).split(" ");
                    _list.gen(arr[1], data, arr[2], arr[0], msg.channel.name);
                    msg.delete()
                    await msg.channel.send("Download the List below", { files: [`${appDir}/list/${msg.channel.name}.txt`] });
                    fs.unlink(`${appDir}/list/${msg.channel.name}.txt`, (err) => {
                        if (err) {
                            console.log("failed to delete local image:" + err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    });
                }
            })
        }
        // ENDHERE the styling need to be fix
        else if (cmd === "!help") {
            msg.delete()
            msg.channel.send(embed.commands);
        }

    }

    // console.log(`${msg.author.username} said: ${msg.content}`)
    // console.log(server.channels)

})

client.login(process.env.BOT_TOKEN);


// channel.updateOverwrite(message.author, {
// 	SEND_MESSAGES: false,
// });