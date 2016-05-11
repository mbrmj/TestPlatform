module.exports = function(app) {
  console.log("in LIB INFOHOST");
    app.get('/_infohost', function(req, res) {
        var os = require('os');
        var util = require('util');
        console.log("in infoHost LIB -/_infohost");
        var response = {

            "this_host": os.hostname(),

            "this_Network": os.networkInterfaces()

        };
        res.write(JSON.stringify(response));
        res.end();


    });

    return app;
}
