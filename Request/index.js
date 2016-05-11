var mongoose = require('mongoose');

var express = require('express');
var app = express();


mongoose.connect('mongodb://localhost/Response_container_info');
var Container = mongoose.model('container', {
    _id: String,
    name: String
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    containers = Container.find({}, main());
});

function getContainer(container){
  var containers;
  Container.find({_id :container.id},function(err,container)){
      if(err){
          response(1);
      }else if(container.length){
          response(0,container,containers[container.id]);
      }else{
        containers[container.id]=container.name;
        newContainer(container.id,container.name);
      }
  });
}
function response(0,container,name){

}

function newContainer(id, name) {
    var container = new Container({
        id: id,
        name: name
    });
    kitty.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('container : ' + id + ':' + name + 'saved !!');
        }
    });
}







function checkIfExist(id) {

}

function main() {
    var auth1 = {
        user: '2D833490801F8499AC90',
        pass: 'vooncfWDaaXjSUy2KgiTNq85Giyw3GYxyLvXLkpz'
    };

    app.get('/', function(req, res) {
        res.end();
    });

    app.get('/:rancher/:addr/:subaddr', function(req, res) {
        var request = require('request');
        console.log('Sending Request !!!   http://' + req.params.addr + '/' + req.params.subaddr + '/');
        request('http://' + req.params.addr + '/' + req.params.subaddr + '/', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                pbody = JSON.parse(body);
                var uri = 'http://' + req.params.rancher + '/v1/projects/1a5/containers?externalId_prefix=' + pbody.this_host;
                console.log(uri);
                request.get(uri, {
                    auth: auth1
                }, function(err, response, body) {
                    if (!err) {
                        var data = JSON.parse(body).data;
                        console.log(data);
                        res.send(data[0].name);
                    } else {
                        console.log('Unable to find Container name id= ' + pbody.this_host);
                        res.send('Unable to find Container name id= ' + pbody.this_host);
                    }
                });
            }
        })
    });
    app.listen(3000, function() {
        console.log('Listen to port 3000!');
    });
}
