var express = require('express');
var router = express.Router();
var md5 = require('MD5');
var usersModel = require('../models/user');
var wikiModel = require('../models/wiki');
var wikiDocumentsModel=require('../models/wiki_documents');
var waterfall = require('async-waterfall');
var async = require('async');
var log = require('../lib/logger');
var config = require('../config/config');
var trim = require('trim');
var encoder = require('../lib/encoder');
var encode = encoder;
var apptitle = 'Wiki';

// Handle login
router.post('/login', function(req, res) {
	var data = req.body;
    var username = trim(data.username) || '';
    var password = trim(data.password) || '';
    var userInfo;
     
    // If any of the inputs is blank
    if (username == '' || password == '') {
    	redirectLogin(req, res, 'Wrong username or password');  
    }
    else {
    	//Get user info. from activedir... Check user in both pune and chennai location
		async.series({
			puneResult : function (callback){
				config.adPune.findUser(username, function(adPuneErr, puneUser) {
					if (adPuneErr) {
						log.logger.error(adPuneErr);    									
					    console.log('adPune ERROR: ' +JSON.stringify(adPuneErr));
					    return;
					}									
				    callback(null, puneUser);  								
				});						  
			},
			chennaiResult : function (callback){
				config.adChennai.findUser(username, function(adChennaiErr, chennaiUser) {
					if (adChennaiErr) {
						log.logger.error(adChennaiErr);    									
					    console.log('adChennai ERROR: ' +JSON.stringify(adChennaiErr));
					    return;
					}						
				    callback(null, chennaiUser);  								
				});						  
			},      	
		}, function(err, results) {
			if (err) {
				log.logger.error(err);    												    
			    return;
			}
			else{				
				if(results.puneResult){  // If user is from pune
					userInfo = results.puneResult;
					userInfo.password = password;
					findAndAuthenticate(req, res, userInfo);
				}
				else if(results.chennaiResult){	// If user is from chennai
					userInfo = results.chennaiResult;
					userInfo.password = password;
					findAndAuthenticate(req, res, userInfo);
				}
				else{	// If user is not found redirect to login page
					redirectLogin(req, res, 'Wrong username or password');			
				}
			} 			
		});		
	}	
});

// Redirect user to home page depending upon session value
router.get("/home", function (req, res) {
	if (req.session.loggedIn) {						
		res.redirect('/wiki/dashboard');
				
	} else {
		res.redirect('/');
	}
});

//Get all users information from user table... this is used for autocomplete
router.get("/getAllUsers", function (req, res) {
	usersModel.getAllUsers(function executeSql(err, users){ 
       if (err){     	   
    	   log.logger.error(err);	
    	   return; 
       }
       var userInfo = [];
       if (users.length > 0){
    	   for(var i=0;i<users.length;i++){    		  
    		   // Create user information in 'username<username@domain.com>' format
    		   userInfo.push(users[i].username + "<"+users[i].email+">") ; 
    	   }
    	   userInfo.join(',')
       }		
       res.send(userInfo);
	});   
});

module.exports = router;

//Funtion to redirect user on login error
function redirectLogin(req, res, errMsg){
	wikiModel.getWikiHomepage(function executeSql(sqlErr, rows) {			
		if (sqlErr) {
			log.logger.error(sqlErr);
			return;
		} else {					
			var wiki_content = '';				
			wiki_content = encode.htmlDecode(rows[0].wiki_content);
			res.render('index', {
				wikitype:'',
				wiki_content : wiki_content,
				message_login:'<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Error!</h4> '+ errMsg +' </div>',
				title : apptitle,
				page_message : '',
				logged:req.session.loggedIn,
				session_user : '',		
			});	
			return;
		}
	});  
}

//Function to find user and authenticate his/her credentials
function findAndAuthenticate(req, res, userInfo){
	//Check if user account is disabled
	if(userInfo.userAccountControl != config.NORMAL_ACCOUNT){
		//redirect to login page with error message
		redirectLogin(req, res, 'Your account is disabled');	
	}
	else{
		//authenticate user
		authUsername = userInfo.userPrincipalName;
		password = userInfo.password;
		method = '';
		config.adChennai.authenticate(authUsername, password, function(err, auth) {		
  		  if (!auth) {
  			log.logger.error(err); 
  			// authentication failed ... Redirect user to login page
  			redirectLogin(req, res, 'Wrong username or password');
  		  }
  		  else {
  		    // Redirect user to landing page on successful authentication	
  			var sessionData = {username : userInfo.displayName, id: userInfo.employeeID, email: userInfo.mail};  
  			req.session.user = sessionData;  			
  			req.session.loggedIn = true;

  			// Check if user exists with our db...if not insert into users table
  			var params = [userInfo.employeeID];
  			usersModel.checkUserExists(params, function executeSql(err, rows){ 
  				if (err){     	   
  					log.logger.error(err);
  					return;
  				}  			
	  			if(rows.length > 0){
	  				//Check if logged in user is admin and set session var. accordingly 
	  	  			var params = [userInfo.employeeID];
	  	  			usersModel.checkAdminUser(params, function executeSql(err, rows){ 
	  	  				if (err){     	   
	  	  					log.logger.error(err);
	  	  					return;
	  	  				}  				
	  		  			req.session.user.role = (rows.length > 0) ? 'admin' : 'user';  			  		  	
	  		  			res.redirect('/users/home'); 
	  	  			});
	  			} 	
	  			else{
	  				//Insert into users table 
	  				var params = [userInfo.employeeID, userInfo.displayName, userInfo.mail, 0];
	  	  			usersModel.addUser(params, function executeSql(err, rows){ 
	  	  				if (err){     	   
	  	  					log.logger.error(err);
	  	  					return;
	  	  				}  				
	  		  			req.session.user.role = 'user';  			  		  	
	  		  			res.redirect('/users/home'); 
	  	  			});
	  			}
  			});
  		  };
  		});
	}
}