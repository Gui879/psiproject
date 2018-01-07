var db = require('../database/database.js');
var jwt = require('jsonwebtoken');


module.exports.createUser = function(req,res){
    var query ="INSERT INTO users  (username, userpassword,usertype) VALUES ('" + req.body.username + "','" + req.body.userpassword + "','" + req.body.email + "')";
    
    db.query(query).spread(function(result,metadata){
        res.status(200).send("User was sucessfully created.");
    }).catch(function(err){
        res.status(500).send("Error");
    })
}

module.exports.logIn = function(req,res){
    var query ="Select * from login where username = '" + req.body.username + "' and password = '" + req.body.password + "'";
    
    db.projectDB.query(query).spread(function(result,metadata){
        if(result.length > 0){
            var userData = result[0];
            var token = jwt.sign(userData, process.env.SECRET, {expiresIn: 60*60*24});
            delete userData.PASSWORD;
            res.json({
                userData:userData,
                token:token
            });
            
        } else {
            res.status(400).send("Noone Found");
        }
    }).catch(function(err){
        res.status(500).send("unable to process query");
    })
}