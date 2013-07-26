//execute commands
var util = require('util')
var exec = require('child_process').exec;
var sleep = require('sleep');

var whomecontrolpi = require('whomecontrolpi');

var data = [
    {
      "id": "0", "url": "/switches/0", "name": "Switch 1 (00000 A)", "product": "Elro", "script": "00000", "command": "A", "status": "0"
    },
    {
      "id": "1", "url": "/switches/1", "name": "Switch 2 (00000 B)", "product": "Elro", "script": "00000", "command": "B", "status": "0"
    },
    {
      "id": "2", "url": "/switches/2", "name": "Switch 3 (00000 C)", "product": "Elro", "script": "00000", "command": "C", "status": "0"
    },

    {
      "id": "3", "url": "/switches/3", "name": "Switch 4 (00000 A)", "product": "Elro", "script": "00001", "command": "A", "status": "0"
    },
    {
      "id": "4", "url": "/switches/4", "name": "Switch 5 (00000 B)", "product": "Elro", "script": "00001", "command": "B", "status": "0"
    },
    {
      "id": "5", "url": "/switches/5", "name": "Switch 6 (00000 C)", "product": "Elro", "script": "00001", "command": "C", "status": "0"
    },

    {
      "id": "6", "url": "/switches/6", "name": "Switch 7 (00000 A)", "product": "Elro", "script": "00010", "command": "A", "status": "0"
    },
    {
      "id": "7", "url": "/switches/7", "name": "Switch 8 (00000 B)", "product": "Elro", "script": "00010", "command": "B", "status": "0"
    },
    {
      "id": "8", "url": "/switches/8", "name": "Switch 9 (00000 C)", "product": "Elro", "script": "00010", "command": "C", "status": "0"
    },

    {
      "id": "9", "url": "/switches/9", "name": "Switch 10 (Rev: A 1)", "product": "Rev", "script": "A", "command": 1, "status": "0"
    },
    {
      "id": "10", "url": "/switches/10", "name": "Switch 11 (Rev: A 2)", "product": "Rev", "script": "A", "command": 2, "status": "0"
    },
    {
      "id": "11", "url": "/switches/11", "name": "Switch 12 (Rev: A 3)", "product": "Rev", "script": "A", "command": 3, "status": "0"
    }
  ];

// GET
exports.switches = function (req, res) {
  console.log('Getting switches.');
  var switches = [];
  res.json(data);
};

exports.switch = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.length) {
    res.json(data[id]);
  } else {
    res.json(404);
  }
};

// POST
exports.addSwitch = function (req, res) {
  var newSwitch = req.body;
  newSwitch.id=data.length;
  newSwitch.url="/switches/"+newSwitch.id;
  newSwitch.status="0";
  console.log('Adding switch: ' + JSON.stringify(newSwitch));
  data.push(newSwitch);
  res.send(201);
};

// PUT
exports.editSwitch = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id <= data.length) {
    console.log('Switch Status of switch with id: ' + id + " to " + req.body.status);
    var script = data[id].script;
    var product = data[id].product;
    var command = data[id].command;
    switchStatus(script,command,product,req.body.status);
    data[id].status = req.body.status;
    res.send(200);
  } else {
    res.json(404);
  }
};

// PUT
exports.editAllSwitches = function (req, res) {
  console.log('Switch Status of all switches to ' + req.body.status);
  for (var i=0;i<data.length;i++){ 
    var script = data[i].script;
    var product = data[i].product;
    var command = data[i].command;
    switchStatus(script,command,product,req.body.status);
    data[i].status = req.body.status;
  }
  res.send(200);
};

// DELETE
exports.deleteSwitch = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.length) {
    console.log('Delete switch with id: ' + id);
    data.splice(id, 1);
    res.send(200);
  } else {
    res.json(404);
  }
};


function switchStatus(script, command, product, status){

  if(product == "Elro") {
    if (status == "1")
      whomecontrolpi.switchElroOn(script, command);
    else if (status == "0")
      whomecontrolpi.switchElroOff(script, command);    
  } else if(product == "Rev") {
    if (status == "1")
      whomecontrolpi.switchRevOn(script, command);
    else if (status == "0")
      whomecontrolpi.switchRevOff(script, command);    
  }
  
  // Maybe for batch job?
  //sleep.sleep(1) //sleep for 1 seconds
}

function puts(error, stdout, stderr) { 
        util.puts(stdout); 
        console.warn("Executing Done");
}