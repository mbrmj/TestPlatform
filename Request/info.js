var Promise = require("es6-promise").Promise;
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var request = require('request');
var redis = require('redis');
//var clientredis = redis.createClient();

var authRancher = {
    user: '2D833490801F8499AC90',
    pass: 'vooncfWDaaXjSUy2KgiTNq85Giyw3GYxyLvXLkpz'
};

rancherServer = "192.168.1.111:10080";



// clientredis.on('connect', function() {
//     console.log('redis connected !!!');
// });





mongoose.connect('mongodb://127.0.0.1/Response_container_info');


var containerSchema = mongoose.Schema({
    _id: String,
    name: String,
});
var Container = mongoose.model('container', containerSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("in the open function before main call !!");
    Container.find({}, function(err, data) {
        if (err) {
            console.log("main:erreur de la 1er lecture de base !!");
        } else {
            console.log("data: ");
            console.log(data);
            containers = data;
            app.get('/', function(req, res) {
                res.end();
            });
            app.get('/:addr/:subaddr', function(req, res) {
                var URI = 'http://' + req.params.addr + '/' + req.params.subaddr + '/';
                console.log('Sending Request !!!   http://' + URI);
                request(URI, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        pbody = JSON.parse(body);
                        testContainerInfoExistance(pbody.this_host).then(function(container) {
                            pbody.name = container;
                            res.send(pbody);
                        });
                    }
                });
            });
            app.listen(3000, function() {
                console.log('Listen to port 3000!');
            });
        }
    });

});

function testContainerInfoExistance(id) {
    id2 = 'id' + id;
    console.log("id2 : " + id2);
    exist = false;
    console.log("-------------------");
    for (var i = 0; i < containers.length; i++) {
        console.log("in for containers[i]._id: " + containers[i]._id);
        if (containers[i]._id == id2) {
            console.log("in If")
            exist = i + 1;
        }
    }
    console.log("-------------------");
    if (exist) {
        console.log("heere1 testContainerInfoExistance if1");
        console.log("Already in the database !!");
        return Promise.resolve(containers[exist - 1].name);
    } else {
        console.log("heere2 testContainerInfoExistance if2");
        return getContainerInfo(id).then(function(container) {
            console.log("in save container :");
            console.log(container);
            rtn = container['name'];
            console.log("container name " + container['name']);
            console.log("in save containerS :");
            console.log(containers);
            ctn = new Container(container);
            ctn.save(function(err) {
                if (err) {
                    console.log("could not save to database !!");
                } else {
                    console.log("saved to database !!");
                    containers[containers.length] = container;
                }
            });

            return rtn;
        });
    }
}

function getContainerInfo(container) {
    var p = new Promise(function(resolve, reject) {
        var uri = 'http://' + rancherServer + '/v1/projects/1a5/containers?externalId_prefix=' + container + '';
        console.log('etContainerInfo' + uri);
        request.get(uri, {
            auth: authRancher
        }, function(err, response, body) {
            if (!err) {
                var data = JSON.parse(body).data;
                container2 = 'id' + container;
                //containers[container2] = data[0].name;
                console.log("gere1 : " + data[0].name);
                obj = {};
                obj['_id'] = container2;
                obj['name'] = data[0].name;
                console.log("test obj");
                console.log(obj)
                resolve(obj);
            } else {
                throw ('Unable to find Container name id= ' + container);
                console.log("gere2");
                reject("Error in getContainerInfo " + err);
            }

        });
    });

    return p;
}
