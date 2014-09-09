var express = require('express');
var router = express.Router();
var eventModel = require('../models/event');
var apptitle = 'Wiki';

var logAndRespond = function logAndRespond(err,res,status){
    console.error(err);
    res.statusCode = ('undefined' === typeof status ? 500 : status);
    res.send({
        result: 'error',
        err:    err.code
    });
};

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

router.post('/event', function(req, res) {
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.id;
	var tid = sid;

	delete data.id;
	delete data.gr_id;
	delete data["!nativeeditor_status"];
	if (req.session.loggedIn) {
		 if (mode == "updated"){
			    //console.log("Data updated " + JSON.stringify(data, null));
			    var params = [data.text, data.start_date, data.end_date, req.session.user.id,  data.type, data.event_id];
			    eventModel.updateEvent(params, function executeSql(sqlErr, rows) {
					if (sqlErr) {
						mode = "error";
						logAndRespond(sqlErr, res);
						return;
					} else {
						tid = data._id;
						res.setHeader("Content-Type","text/xml");	    
						res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
					}
				});	
		    }
		    else if (mode == "inserted"){
			    //console.log("Data inserted" + JSON.stringify(data, null));
			    var params = [data.start_date, data.end_date, data.text, data.type, req.session.user.id];
			    eventModel.createEvent(params, function executeSql(sqlErr, rows) {
					if (sqlErr) {
						mode = "error";
						logAndRespond(sqlErr, res);
						return;
					} else {
						tid = data._id;
						res.setHeader("Content-Type","text/xml");
						res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
					}
				});			   
		    }
		    else if (mode == "deleted"){
			    //console.log("Data deleted  " + JSON.stringify(data, null));
			    var params = [data.event_id];
			    eventModel.deleteEvent(params, function executeSql(sqlErr, rows) {
					if (sqlErr) {
						mode = "error";
						logAndRespond(sqlErr, res);
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

router.get('/getEvent', function(req, res) {
	if (req.session.loggedIn) {	
		var params = [req.session.user.id];
		eventModel.getEvent(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				mode = "error";
				logAndRespond(sqlErr, res);
				return;
			} else {
				res.send(rows);
			}
		});	
	} else {
        res.redirect('/');
    }
});

module.exports = router;