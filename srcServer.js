var express = require('express');
var path = require('path');

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test");

const port = 8888;
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('client'));

app.use('/static', express.static(path.join(__dirname, 'client')))

var nameSchema = new mongoose.Schema({
  UserName: String,
  latitude: Number,
  longitude: Number,
 });

var User = mongoose.model("User", nameSchema);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname,'../client/home_page.html'))
});

app.listen(port);

app.post("/insertall", (req, res) => {
  var flag = 0;
  console.log(req)
  console.log(req.body)
  
  if(req.body.UserName!=undefined){
    var myData = new User(req.body);
    var query = {'UserName':req.body.UserName};
  /*User.find({}, function(err, users) {
    var userMap = []
    for(var i in users)
    {
        if(users[i].UserName==req.body.UserName) 
        {
           flag = 1;
           if(users[i].latitude == req.body.latitude && users[i].longitude == req.body.longitude){
           res.send("item present in Database");}
           else{
             myData.save()
           }
           break;
        }
    }
  });
    if(!flag){
  
      myData.save()
      .then(item => {
          console.log("item");
          console.log(item);
          res.send("item saved to database");
      })
      .catch(err => {
          res.status(400).send("unable to save to database");
      });
    }*/
      User.findOneAndUpdate(query,myData,{upsert: true, new: true, runValidators: true},
          function (err, doc) { 
            if (err) {res.send("item present in Database and updated");
            } 
             else{
             res.send("new item saved to database");
            }
          });
    }
    else{
      res.send("Bad username found. Item not saved")
    }
 });

 app.get('/home.html', function(req, res) {
   //res.render('home',{})
   res.sendFile(path.join(__dirname,'../client/home.html'))
});

app.post('/findall',function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var host = req.get('host');
  console.log("host"+host)
  //var search_key = req.param('search');
  User.find({}, function(err, users) {
    var userMap = []
    for(var i in users)
    {
        if(users[i]==null || users[i]==''|| users[i].latitude == undefined ||
         users[i].longitude=="undefined" || users[i].UserName==undefined) 
        {
           delete users[i]
        }
    }
      users.forEach(function(user) {
        userMap.push({"UserName":user.UserName,"longitude":user.longitude,"latitude":user.latitude})
    });
    console.log("userMap")
    console.log(userMap)
  //document.getElementsByName('Data').html()
  res.send(userMap);
 });
});



