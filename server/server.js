var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var db = require('./database/database');
var jwt =require('jsonwebtoken');



process.env.SECRET ="A SECRET";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/client',express.static(path.join(__dirname, '../client')));
//Controllers
var userController =require('./controllers/user-controller.js');

//Routers
var secureUserRouter = require('./routes/user.js');
var uploadRouter = require('./routes/upload.js');

app.use('/upload', uploadRouter);
app.use('/secure/api/user', secureUserRouter);

app.get('/',function(req,res){
    res.sendFile('index.html',{root: path.join(__dirname, '../client')});
})

app.post('/api/user/create',userController.createUser);
app.post('/api/user/login',userController.logIn);



db.projectDB.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
db.projectDB.sync().then(function(){
    app.listen(3000,function(){
        console.log("Started!");
    })
})