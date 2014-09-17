var mysql = require('mysql');
var config = require('../config/config');
var env = config.environment;
var connection = mysql.createConnection(config[env].database);
connection.connect();

var createEventType = function(params, callback) {
	var qry = 'INSERT INTO event_type (event_type, event_color) values (?,?)';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in createEventType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getEventTypes = function(params, callback) {
	var qry = 'SELECT * FROM event_type WHERE is_deleted = 0 LIMIT ?, ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getEventTypes query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getAllEventTypes = function(callback) {
	var qry = 'SELECT * FROM event_type WHERE is_deleted = 0';
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAllEventTypes query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getEventType = function(params, callback) {
	var qry = 'SELECT * FROM event_type WHERE event_type_id = ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getEventType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getEventTypeCount = function(params, callback) {
	var qry = 'SELECT count(*) AS Count FROM event_type WHERE is_deleted = 0';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getEventTypeCount query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var updateEventType = function(params, callback) {
	var qry = 'UPDATE event_type SET event_type= ?, event_color= ? WHERE event_type_id= ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in updateEventType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var deleteEventType = function(params, callback) {
	var qry = 'UPDATE event_type SET is_deleted= 1 WHERE event_type_id= ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in deleteEventType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var createEvent = function(params, callback) {
	var qry = 'INSERT INTO events (start_date, end_date, text, type, userId) values (?,?,?,?,?)';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in createEvent query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var updateEvent = function(params, callback) {
	var qry = 'UPDATE events SET text= ?, start_date= ?, end_date= ?, userId= ?, type= ? WHERE event_id= ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in updateEvent query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var deleteEvent = function(params, callback) {
	var qry = 'UPDATE events SET is_deleted= 1 WHERE event_id= ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in deleteEvent query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getEvent = function(params, callback) {	
	var qry = "SELECT events.*, IF((userId = ? OR ? IN(?)),0,1) AS readonly, 'white' AS textColor, event_type.event_color AS color";
	qry += " FROM events LEFT JOIN event_type ON events.type = event_type.event_type_id";
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getEvent query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

exports.getEvent = getEvent;
exports.getEventTypes = getEventTypes;
exports.getEventType = getEventType;
exports.getEventTypeCount = getEventTypeCount;
exports.updateEventType = updateEventType;
exports.createEventType = createEventType;
exports.deleteEventType = deleteEventType;
exports.getAllEventTypes = getAllEventTypes;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;