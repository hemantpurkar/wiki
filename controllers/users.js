var express = require('express');
var router = express.Router();
var md5 = require('MD5');
var usersModel = require('../models/user');
var wikiModel = require('../models/wiki');
var wikiDocumentsModel=require('../models/wiki_documents');
var waterfall = require('async-waterfall');
var apptitle = 'Wiki';

var logAndRespond = function logAndRespond(err,res,status){
    console.error(err);
    res.statusCode = ('undefined' === typeof status ? 500 : status);
    res.send({
        result: 'error',
        err:    err.code
    });
};

router.post('/login', function(req, res) {
	var data = req.body;
    var username = data.username || '';
    var password = data.password || '';
    
    if (username == '' || password == '') {
            res.render('index', {
                title:apptitle,
                logged:req.session.loggedIn,
                message_login:'<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Error!</h4>Wrong username or password</div>',
				wikitype:''
            });             
            return;
    }
    else {
		password = md5(req.body.password);
	
		var conditions = " username = '"+ username + "' AND password = '" + password + "'";
		usersModel.getUser(conditions, function executeSql(err, rows){ 
			if (err){ 
				logAndRespond(err,res); 
				return; 
			}
			else if (rows.length === 0){
					res.render('index', {
						title:apptitle,
						logged:req.session.loggedIn,
						message_login:'<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Error!</h4>Wrong username or password</div>',
						wikitype:''
						});                
				   return;
			}
			else {
				req.session.user = rows[0];
				req.session.user.role = (rows[0].is_admin == 1) ? 'admin' : 'user';
				req.session.loggedIn = true;
				res.redirect('/users/home'); 
			}	
		});  
	}	
});

router.get('/registration', function(req, res) {
	res.render('user/registration', {
		title: apptitle,
		message_login:'',
		message:''
	});
});

router.post('/registration', function(req, res) {
	var data = req.body;
    var username  = data.username || '';
    var password  = data.password || '';
    var email  = data.email || '';
    
    if(username == '' || password == '' || email == ''){
               res.render('user/registration', {
                   title: apptitle,
                   message:'<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Error!</h4>Username, Password and Email can not be blank</div>',
                   message_login:''
               });
                connection.release();
               return;
    }
    
    var password = md5(req.body.password);
    
    var params = [username];
    usersModel.checkUserExists(params, function executeSql(err, rows){ 
       if (err){ 
    	   logAndRespond(err,res); 
    	   return; 
       }
       if (rows.length > 0){         
         res.render('user/registration', {
                   title: apptitle,
                   message:'<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Error!</h4>Username already Exits</div>',
                   message_login:''
               });
         return;
       }
    });   
    
    var params = [username, password, email];
    usersModel.addUser(params, function executeSql(err, rows){
		if (err){ 
			logAndRespond(err,res); 
			return; 
		}
		res.statusCode = 201;
		res.render('user/registration', {
                   title: apptitle,
                   message:'<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Success!</h4>Registration completed successfully</div>',
                   message_login:''
               });		
    });
});

// home
router.get("/home", function (req, res) {
	if (req.session.loggedIn) {			
		
		//var isAdmin = req.session.user.is_admin;
		//For admin user, show wiki listing page..
		//For other users show a selected home page...
		/*if(isAdmin === 0){
			waterfall([
			    function(callback){ 
			    	var params = [req.session.user.id];
					wikiModel.getWikiHomepage(params, function executeSql(sqlErr1, rows1) {		    		 
						if (sqlErr1) {
							logAndRespond(sqlErr1, res);
							return;
						} else {	
							callback(null, rows1);						
						}
					});
			    },	
			    function(rows1, callback){
				    var params = [rows1[0].wiki_id];
				    console.log("params::",rows1[0].wiki_id);
					wikiDocumentsModel.getWikiDocuments(params, function executeSql(sqlErr2, rows2) {
						if (sqlErr2) {
							logAndRespond(sqlErr2, res);
							return;
						} else {	
							res.statusCode = 201;
							res.render('user/home', {
								data : rows1[0],
								message : '',
								title : apptitle,
								wikiattchment : rows2,
								page_message : '',
								session_user : req.session.user,												
							});
							return;
						}	
						callback(null, 'done');
					});										
				},									   
			 ], function(err, result) {
				// result now equals 'done'
			});
		}
		else{
			res.redirect('/wiki/dashboard');
		}*/
		res.redirect('/wiki/dashboard');
				
	} else {
		res.redirect('/');
	}
});
module.exports = router;