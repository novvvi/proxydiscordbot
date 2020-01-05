const { pstream } = require("../config/pstream")
const { parse } = require("node-html-parser")
const qs = require('querystring')


module.exports ={
    balance: async (auth, callback) => {
        headers = {
            headers : {
                'cookie': `auth=${auth};`
            }
        }
        await pstream.get("/dashboard", headers)
        .then( response => {
            var root = parse(response.data);
            var text = root.querySelector('.card-block').firstChild.querySelector("h2").text
            callback(Number(text.replace(/(\$)/, "")))
        })
        .catch(err => {
            console.log(`[${Date.now()}]`,err)
            callback(null)
        })
    },
    changePassword: async (auth, csrf, callback) => {
        headers = {
            headers : {
                'cookie': `auth=${auth};_csrf=${csrf};`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        payload = {
            csrf : csrf
        }

        await pstream.post("/dashboard/reset_passkey", qs.stringify(payload),headers)
        .then( response => {
            var root = parse(response.data);
            var text = root.querySelector('#proxy-password-base').attributes.value
            callback(text)
        })
        .catch(err => {
            console.log(`[${Date.now()}]`,err)
            callback(null)
        })
    }
}