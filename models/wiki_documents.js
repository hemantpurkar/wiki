var mysql = require('mysql');
var config = require('../config/config');
var env = config.environment;
var connection = mysql.createConnection(config[env].database);
connection.connect();

var getWikiDocuments = function(params, callback) {
	var qry = 'SELECT * FROM wiki_documents WHERE wiki_id = ? AND is_active=1';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getWikiDocuments query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var deleteWikiDocument = function(params, callback) {
	var qry = 'DELETE FROM wiki_documents WHERE document_id = ? AND wiki_id = ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in deleteWikiDocument query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getDocumentDetails = function(params, callback) {
	var qry = 'SELECT * FROM wiki_documents WHERE document_id = ? AND is_active=1';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getDocumentDetails query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

exports.getWikiDocuments = getWikiDocuments;
exports.deleteWikiDocument = deleteWikiDocument;
exports.getDocumentDetails = getDocumentDetails;