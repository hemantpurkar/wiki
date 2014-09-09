var mysql = require('mysql');
var config = require('../config/config')['development'];
var connection = mysql.createConnection(config.database);
connection.connect();

var getWikiTypes = function(params, callback) {
	var qry = 'SELECT * FROM wiki_type WHERE is_deleted = 0 LIMIT ?, ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getWikiTypes query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getAllWikiTypes = function(params, callback) {
	var qry = 'SELECT * FROM wiki_type WHERE is_deleted = 0';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getWikiTypes query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getWikiType = function(params, callback) {
	var qry = 'SELECT * FROM wiki_type WHERE type_id = ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getWikiType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getWikiTypeCount = function(params, callback) {
	var qry = 'SELECT count(*) AS Count FROM wiki_type WHERE is_deleted = 0';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getWikiTypeCount query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getWikiPagesCount = function(params, callback) {
	var qry = 'SELECT count(*) AS Count FROM wiki WHERE wiki_active = 1';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getWikiPagesCount query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}


var addWikiPage = function(params, callback) {
	var qry = 'INSERT INTO wiki (wiki_title, wiki_content, updated_date, user_id, wiki_type) VALUES (?,?,?,?,?)';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in addWikiPage query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var addWikiDocument = function(params, callback) {
	var qry = 'INSERT INTO wiki_documents (document_name, original_name, mime_type, wiki_id, created_on, is_active) values (?,?,?,?,?,?)';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in addWikiDcoument query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var listWiki = function(params, callback) {
	var qry = 'SELECT wiki_id, wiki_title FROM wiki where wiki_active=1 ORDER BY updated_date DESC LIMIT ? , ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in listWiki query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getAllWiki = function(callback) {
	var qry = 'SELECT wiki_id, wiki_title FROM wiki where wiki_active=1 ORDER BY wiki_title ASC';
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAllWiki query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getRecentWiki = function(callback) {
	var qry = 'SELECT wiki_id, wiki_title, DATE_FORMAT( updated_date,  "%d %b %Y ,%h:%i %p" ) AS updated_on FROM wiki where wiki_active=1 ORDER BY updated_date DESC';
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getRecentWiki query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}


var viewWiki = function(params, callback) {
	var qry = 'SELECT wiki_id, wiki_title, wiki_content, wiki_type, DATE_FORMAT(updated_date,"%d %b %Y ,%h:%i %p") AS updated_date, user.username  FROM wiki INNER JOIN user ON wiki.user_id=user.id WHERE wiki.wiki_id = ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in viewWiki query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var updateWikiPage = function(params, callback) {
	var qry = 'UPDATE wiki SET wiki_title= ?, wiki_content= ?, updated_date= ?, user_id= ?, wiki_type= ? WHERE wiki_id= ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in updateWikiPage query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var updateWikiType = function(params, callback) {
	var qry = 'UPDATE wiki_type SET wiki_type= ? WHERE type_id= ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in updateWikiType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var createWikiType = function(params, callback) {
	var qry = 'INSERT INTO wiki_type (wiki_type) values (?)';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in createWikiType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var deleteWikiType = function(params, callback) {
	var qry = 'UPDATE wiki_type SET is_deleted=1 WHERE type_id= ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in deleteWikiType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getWikiHomepage = function(params, callback) {		
		var qry = 'SELECT wiki.wiki_id, wiki.wiki_title, wiki.wiki_content, wiki.wiki_type, DATE_FORMAT( updated_date,  "%d %b %Y ,%h:%i %p" ) AS updated_date';
		qry += ' FROM wiki AS wiki';
		qry += ' LEFT JOIN wiki_users ON wiki.wiki_id = wiki_users.wiki_id';
		qry += ' LEFT JOIN group_users gu ON gu.group_id = wiki_users.group_id AND gu.user_id = 1';
		qry += ' WHERE wiki.home_page =1';	
		qry += ' ORDER BY wiki.updated_date DESC';	
		qry += ' LIMIT 0 , 1';	
		
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in viewWiki query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

exports.getWikiType = getWikiType;
exports.getWikiTypes = getWikiTypes;
exports.getAllWikiTypes = getAllWikiTypes;
exports.getWikiTypeCount = getWikiTypeCount;
exports.updateWikiType = updateWikiType;
exports.createWikiType = createWikiType;
exports.deleteWikiType = deleteWikiType;
exports.addWikiPage = addWikiPage;
exports.updateWikiPage = updateWikiPage;
exports.listWiki = listWiki;
exports.viewWiki = viewWiki;
exports.addWikiDocument = addWikiDocument;
exports.getWikiPagesCount = getWikiPagesCount;
exports.getWikiHomepage = getWikiHomepage;
exports.getAllWiki = getAllWiki;
exports.getRecentWiki = getRecentWiki;