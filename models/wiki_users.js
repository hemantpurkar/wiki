var mysql = require('mysql');
var config = require('../config/config');
var env = config.environment;
var connection = mysql.createConnection(config[env].database);
connection.connect();

var getAllWikiUsers = function(params, callback) {
	var qry = 'SELECT * FROM wiki_users WHERE wiki_id = ?';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAllWikiUsers query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var addWikiUsers = function(params, callback) {
	var qry = 'INSERT INTO wiki_users (wiki_id, group_id) VALUES (?,?)';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in addWikiUsers query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var deleteWikiUsers = function(params, callback) {
	var qry = 'DELETE FROM wiki_users WHERE wiki_id = ?';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in deleteWikiUsers query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var checkWikiUser = function(params, callback) {
	var qry = 'SELECT COUNT(*) AS cnt FROM wiki_users wu '
		qry += 'LEFT JOIN group_users gu ON wu.group_id = gu.group_id '
		qry += 'WHERE wu.wiki_id = ? AND gu.user_id = ?';
	
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in checkWikiUser query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

exports.addWikiUsers = addWikiUsers;
exports.getAllWikiUsers = getAllWikiUsers;
exports.deleteWikiUsers = deleteWikiUsers;
exports.checkWikiUser = checkWikiUser;