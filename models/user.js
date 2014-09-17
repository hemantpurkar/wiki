var mysql = require('mysql');
var config = require('../config/config');
var env = config.environment;
var connection = mysql.createConnection(config[env].database);
connection.connect();

var getUser = function(conditions, callback) {
	var qry = 'SELECT * FROM user';
	if (conditions) {
		qry += ' WHERE ' + conditions;
	}
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getUser query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getAllUsers = function(callback) {
	var qry = 'SELECT * FROM user WHERE is_admin = 0 ORDER BY username ASC';
	
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAllUsers query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getUserList = function(params, callback) {
	var qry = 'SELECT * FROM user ORDER BY username ASC LIMIT ? , ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getUserList query ", err);
			callback(err);
		} else {		
			callback('', rows);
		}
	})
}

var getUserCount = function(callback) {
	var qry = 'SELECT count(*) AS Count FROM user';
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getUserCount query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var checkUserExists = function(params, callback) {
	var qry = 'SELECT * FROM user WHERE username = ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in checkUseExists query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var addUser = function(params, callback) {
	var qry = 'INSERT INTO user (username, password, email) values (?,?,?)';
	connection.query(qry, params,function(err, rows, fields) {
		if (err) {
			console.log("Error in addUser query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getAdminUser = function(params, callback) {
	var qry = 'SELECT id FROM user WHERE is_admin = 1';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAdminUser query ", err);
			callback(err);
		} else {		
			callback('', rows);
		}
	})
}

exports.getUser = getUser;
exports.getUserList = getUserList;
exports.getUserCount = getUserCount;
exports.getAllUsers = getAllUsers;
exports.checkUserExists = checkUserExists;
exports.addUser = addUser;
exports.getAdminUser = getAdminUser;