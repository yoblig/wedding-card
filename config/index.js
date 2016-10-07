var configValues = require("./config");

module.exports = {
    getDbConnectionString: function(){
        //mongodb://<dbuser>:<dbpassword>@ds021663.mlab.com:21663/dev
        return 'mongodb://' + configValues.uname + ':' + configValues.pwd + '@ds053216.mlab.com:53216/weddingcard';
    }
}