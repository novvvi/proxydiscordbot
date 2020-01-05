var resource = require('./server/api/resource')
var list = require('./server/config/genlist')

var test = async () =>{
    return await list.gen(10, {pass: "123456", user: "novi"}, "uk", "-r")
}


test()