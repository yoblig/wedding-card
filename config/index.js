var configValues = require("./config");

module.exports = {
    getDbConnectionString: function(){
        mongodb://Test:test@ds053216.mlab.com:53216/weddingcard
        return 'mongodb://' + configValues.uname + ':' + configValues.pwd + '@ds053216.mlab.com:53216/weddingcard';
    }
}