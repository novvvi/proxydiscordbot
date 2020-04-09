const fs = require('fs');
var RandExp = require('randexp');
var path = require('path');

exports.gen = (num, data, location, setting, chan) => {
    var countries = {
        rdm: "",
        us: "_country-UnitedStates",
        uk: "_country-UnitedKingdom",
        ca: "_country-Canada",
        jp: "_country-Japan",
        sa: "_country-Singapore", 
        kr: "_country-SouthKorea",
        hk: "_country-HongKong"
    }
        
    if(num > 500) {
        num = 500;
    }

    // var ip = iphost[Math.floor(Math.random()*iphost.length)];
    var proxy = `use.enviproxy.us:31112:${data.user}:${data.pass}${countries[location]}`
    randexp = new RandExp(/\w{7}/);
    var appDir = path.dirname(require.main.filename);

    var list = ""

    if(setting === "-r") {
        for(i = 0; i <= num; i++){
            list += proxy + '\r\n'
        }
    } else if(setting === "-s") {
        for(i = 0; i < num; i++){
            list +=  proxy + "_session-" + randexp.gen() + '\r\n'
        }
    }


    fs.appendFile(`${appDir}/list/${chan}.txt`, list , function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}
