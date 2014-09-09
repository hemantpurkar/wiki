var mysql = require('mysql');
var config = require('../config/config')['development'];
var connection = mysql.createConnection(config.database);
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

exports.addWikiUsers = addWikiUsers;
exports.getAllWikiUsers = getAllWikiUsers;
exports.deleteWikiUsers = deleteWikiUsers;