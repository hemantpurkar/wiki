var mysql = require('mysql');
var config = require('../config/config');
var env = config.environment;
var connection = mysql.createConnection(config[env].database);
connection.connect();

var getGroupList = function(params, callback) {
	var qry = 'SELECT * FROM groups WHERE is_deleted = 0 ORDER BY group_name ASC LIMIT ? , ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getGroupList query ", err);
			callback(err);
		} else {		
			callback('', rows);
		}
	})
}

var getGroupCount = function(callback) {
	var qry = 'SELECT count(*) AS Count FROM groups WHERE is_deleted = 0';
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getGroupCount query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getAllGroups = function(callback) {
	var qry = 'SELECT * FROM groups WHERE is_deleted = 0 ORDER BY group_name ASC';
	
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAllGroups query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var addGroup = function(params, callback) {
	var qry = 'INSERT INTO groups (group_name, group_email, created_by, created_on, updated_on) VALUES (?,?,?,?,?)';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in addGroup query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getGroupInfo = function(params, callback) {
	var qry = 'SELECT group_name, group_email FROM groups WHERE group_id IN( ? )';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getGroupInfo query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}


var updateGroup = function(params, callback) {
	var qry = 'UPDATE groups SET group_name = ?, group_email = ?, updated_on = ?  WHERE group_id = ?';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in updateGroup query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var deleteGroup = function(params, callback) {
	var qry = 'UPDATE groups SET is_deleted = 1 WHERE group_id = ?';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in deleteGroup query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}


exports.getGroupList = getGroupList;
exports.getGroupCount = getGroupCount;
exports.getAllGroups = getAllGroups;
exports.addGroup = addGroup;
exports.getGroupInfo = getGroupInfo;
exports.updateGroup = updateGroup;
exports.deleteGroup = deleteGroup;