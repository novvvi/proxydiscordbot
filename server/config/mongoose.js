var path = require('path');
var fs = require('fs'); // able to use all the files
// var mongoose = require('mongoose');


var mongoose = require('mongoose-ssh')
var config = {
    username:'root',
    host:'66.228.34.212',
    port:22,
    dstPort:27017,
    password:'nklHui10m14d!'
};


mongoose.connect(config, 'mongodb://localhost/psdiscord',{ useFindAndModify: false });
mongoose.Promise = global.Promise;

var models_path = path.join(__dirname, './../models');

// iterate through the models folder and searches for all model files!!!
fs.readdirSync(models_path).forEach(function(file){
    if(file.indexOf('.js')>=0){
        require(models_path + '/' + file);
    }
});