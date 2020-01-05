const axios = require('axios')

module.exports.pstream = axios.create(
    {
        baseURL: "https://packetstream.io"
    }
)