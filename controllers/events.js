var express = require('express');
var router = express.Router();
var eventModel = require('../models/event');
var userModel = require('../models/user');
var waterfall = require('async-waterfall');
var log = require('../lib/logger');
var apptitle = 'Wiki';
var fs = require('fs-extra');

//Get all calendar events to display on daywise calendar page
router.get('/calendar', function(req, res) {
	if (req.session.loggedIn) {
        res.render('event/events', {
            user:req.session.user,
            title: apptitle,
            logged:req.session.loggedIn,
            wikitype:'',
            session_user : req.session.user
        });
    } else {
        res.redirect('/');
    }
});

//Create an event and display on calendar page
router.post('/event', function(req, res) {
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.id;
	var tid = sid;

	delete data.id;
	delete data.gr_id;
	delete data["!nativeeditor_status"];
	if (req.session.loggedIn) {		
		 if (mode == "updated"){ //If updating existing event
			    var params = [data.text, data.start_date, data.end_date, req.session.user.id,  data.type, data.event_id];
			    eventModel.updateEvent(params, function executeSql(sqlErr, rows) {
					if (sqlErr) {
						mode = "error";
						log.logger.error(sqlErr);	
						return;
					} else {
						tid = data._id;
						res.setHeader("Content-Type","text/xml");	    
						res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
					}
				});	
		    }
		    else if (mode == "inserted"){	//If adding new event
			    var params = [data.start_date, data.end_date, data.text, data.type, req.session.user.id];
			    eventModel.createEvent(params, function executeSql(sqlErr, rows) {
					if (sqlErr) {
						mode = "error";
						log.logger.error(sqlErr);	
						return;
					} else {
						tid = data._id;
						res.setHeader("Content-Type","text/xml");
						res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
					}
				});			   
		    }
		    else if (mode == "deleted"){ //If deleting existing event
			    var params = [data.event_id];
			    eventModel.deleteEvent(params, function executeSql(sqlErr, rows) {
					if (sqlErr) {
						mode = "error";
						log.logger.error(sqlErr);	
						return;
					} else {
						tid = data._id;
						res.setHeader("Content-Type","text/xml");
						res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
					}
				});				   
		    }
		    else{
			    res.send("Not supported operation");
		    }
	}
});

//Get event information
router.get('/getEvent', function(req, res) {
	if (req.session.loggedIn) {	
		waterfall([
		    function(callback){
		    	//get admin user details 
		    	userModel.getAdminUser(function executeSql(sqlErr1, rows1) {
					if (sqlErr1) {
						log.logger.error(sqlErr1);	
						callback(sqlErr1, ''); 
					} else {	
						callback(null, rows1);						
					}
				});
		    },	
		    function(rows1, callback){	
		    	var users = [];
		    	var admin_users = [];
		    	users.push(req.session.user.id);
		    	users.push(req.session.user.id); // Pushing same var. twice to check with Admin user in sql 
		    	if(rows1.length > 0){
		    		for(i=0;i<rows1.length;i++){
		    			admin_users.push(rows1[i].id);
		    		}
		    	}
		    	users.push(admin_users);
		    	var params = users;
				eventModel.getEvent(params, function executeSql(sqlErr2, rows2) {
					if (sqlErr2) {
						mode = "error";
						log.logger.error(sqlErr2);	
						callback(sqlErr2, '');
					} else {
						res.send(rows2);
					}
				});			    												
		    }
		 ], function(err, result) {
			// result now equals 'done'
		});					
	} else {
        res.redirect('/');
    }
});

module.exports = router;