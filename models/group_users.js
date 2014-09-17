var mysql = require('mysql');
var config = require('../config/config');
var env = config.environment;
var connection = mysql.createConnection(config[env].database);
connection.connect();

var getAllGroupUsers = function(callback) {
	var qry = 'SELECT * FROM user u INNER JOIN group_users gu ON u.id = gu.user_id';
	
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAllGroupUsers query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var addGroupUsers = function(params, callback) {
	var qry = 'INSERT INTO group_users (user_id, group_id) VALUES (?,?)';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in addGroupUsers query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var deleteGroupUsers = function(params, callback) {
	var qry = 'DELETE FROM group_users WHERE group_id = ?';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in deleteGroupUsers query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var setGroupLead = function(params, callback) {
	var qry = 'UPDATE group_users SET is_lead = 1 WHERE user_id = ? AND group_id = ?';
	console.log("setGroupLead:::",qry);
	console.log("params:::",params);
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in setGroupLead query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getGroupUsers = function(params, callback) {
	var qry = 'SELECT * FROM group_users WHERE group_id = ?';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getGroupUsers query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

exports.getAllGroupUsers = getAllGroupUsers;
exports.addGroupUsers = addGroupUsers;
exports.setGroupLead = setGroupLead;
exports.deleteGroupUsers = deleteGroupUsers;
exports.getGroupUsers = getGroupUsers;