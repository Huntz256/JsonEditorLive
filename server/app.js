const express = require('express')
var fs = require('fs');
var http = require('http');
var gulp = require('gulp');
var url = require('url');
const app = express();
var dirPath = 'data';
var jsonfile = require('jsonfile')
const del = require('del');
var bodyParser = require('body-parser')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var i = 0;

app.get('/', function (req, res) {
	// res.send('Hello World! Test');
  var fileNames = fs.readdirSync(dirPath);	//Load file names on startup
	res.json(fileNames);

	console.log("Sending File Names");
})

app.delete('/',function (req, res) {
	// res.send('Hello World! Test');
  del(['tmp/*.js', '!tmp/unicorn.js']).then(paths => {
      console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

app.use('/data', express.static(__dirname + '/data'));
app.use(express.static(__dirname + '/public'));

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/', urlencodedParser, function(request, respond) {
  if (!request.body) return respond.sendStatus(400)
    var fileNames = fs.readdirSync(dirPath);	//Load file names on startup
    console.log(request.body.filename);
    //Check if filename exists
    console.log("writing File");
    filePath = __dirname + '/data/' + request.body.filename + '.json';

        jsonfile.writeFile(filePath, request.body.jsonData, function (err) {
          console.error(err)
        })
        console.log(request.body.jsonData);
        // console.log(body);
        respond.end('Wrote file data' + request.body.filename + '.json at' + filePath);
});
app.post('/load', urlencodedParser, function(request, respond) {
  if (!request.body) return respond.sendStatus(400)
  var obj = JSON.parse(fs.readFileSync(__dirname + '/data/' + request.body.filename, 'utf8'));
  console.log(obj);
  respond.json(obj);
  respond.end("Post Load Success");
});
app.post('/delete', urlencodedParser, function(request, respond) {
  if (!request.body) return respond.sendStatus(400)
  fs.unlink(__dirname + '/data/' + request.body.filename, function(err){
    if(err) {
    console.log("File "+ request.body.filename + " does not exist!")}
    else{
      console.log("Deleted file " + request.body.filename);
    }
  });
  respond.json();
  respond.end("Deleted file success");
});
var port = 4000;
app.listen(port, function () {
  console.log('Server Back-end Running on ' + port)
});
