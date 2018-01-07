var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

var storage;
var upload;
router.post('/setimgstorage',function(req,res){
    var customfilename=req.body.filename;
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './client/profilepics')
        },
        filename: function (req, file, cb) {
            cb(null, customfilename+'.png')
        }
    });

    upload = multer({ storage: storage }).single('file');
    res.status(200).send("PAss");
});
    
router.get('/setexcelstorage',function(req,res){
     storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './client/excel')
        },
        filename: function (req, file, cb) {
            
            cb(null, file.fieldname +  '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    upload = multer({
        storage: storage,
        fileFilter : function(req, file, callback) { 
            if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                return callback(new Error('Wrong extension type'));
            }
            callback(null, true);
        }
    }).single('file');
    res.status(200).send("PAss");
});  

router.post('/img',function(req,res){
    upload(req,res,function(err){
        if(err){
            res.status(400).send(err);
            return;
        }
        res.json({ error_code:0,err_desc:null});
    })
});

router.post('/excel', function(req, res) {
        var exceltojson; //Initialization
        var filetodelete;
        upload(req,res,function(err){
            if(err){
                 res.status(400).send(err);
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
                filetodelete ='./client/excel/file.xlsx';
            } else {
                exceltojson = xlstojson;
                filetodelete ='./client/excel/file.xls';
            }
            try {
                exceltojson({
                    input: req.file.path, //the same path where we uploaded our file
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    fs.unlink(filetodelete,function(err){
                      if (err) throw err;
                      console.log('File deleted!');
                    });
                    res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        });
        

});
module.exports = router;