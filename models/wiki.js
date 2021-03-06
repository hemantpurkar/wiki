var mysql = require('mysql');
var config = require('../config/config');
var env = config.environment;
var connection = mysql.createConnection(config[env].database);
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
	var qry = 'SELECT count(*) AS Count FROM wiki WHERE wiki_active = 1 AND home_page=0';
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
	var qry = 'INSERT INTO wiki (wiki_title, wiki_content, updated_date, user_id, wiki_type, home_page) VALUES (?,?,?,?,?,?)';
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
	var qry = 'INSERT INTO wiki_documents (document_name, original_name, mime_type, wiki_id, created_on, is_active) VALUES (?,?,?,?,?,?)';
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
	var qry = 'SELECT wiki_id, wiki_title FROM wiki WHERE wiki_active=1 AND home_page=0 ORDER BY updated_date DESC LIMIT ? , ?';
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
	var qry = 'SELECT wiki_id, wiki_title, wiki_type FROM wiki WHERE wiki_active=1 AND home_page=0 ORDER BY wiki_title ASC';
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAllWiki query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getAllWiki_withHome = function(callback) {
	var qry = 'SELECT wiki_id, wiki_title, wiki_type FROM wiki WHERE wiki_active=1 ORDER BY wiki_title ASC';
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAllWiki_withHome query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getRecentWiki = function(callback) {
	var qry = 'SELECT wiki_id, wiki_title, DATE_FORMAT(updated_date,  "%d %b %Y, %h:%i %p") AS updated_on, user.username '; 
	qry += 'FROM wiki INNER JOIN user ON wiki.user_id = user.id ';
	qry += 'WHERE wiki_active=1 AND home_page=0 ';
	qry += 'ORDER BY updated_date DESC'; 
	
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getRecentWiki query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getRecentWiki_withHome = function(callback) {
	var qry = 'SELECT wiki_id, wiki_title, DATE_FORMAT(updated_date,  "%d %b %Y, %h:%i %p") AS updated_on, user.username '; 
	qry += 'FROM wiki INNER JOIN user ON wiki.user_id = user.id ';
	qry += 'WHERE wiki_active=1 ';
	qry += 'ORDER BY updated_date DESC'; 
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getRecentWiki_withHome query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var viewWiki = function(params, callback) {
	var qry = 'SELECT wiki_id, wiki_title, wiki_content, wiki_type, home_page, DATE_FORMAT(updated_date,"%d %b %Y, %h:%i %p") AS updated_on, user.username  FROM wiki INNER JOIN user ON wiki.user_id=user.id WHERE wiki.wiki_id = ?';
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
	var qry = 'UPDATE wiki SET wiki_title= ?, wiki_content= ?, updated_date= ?, user_id= ?, wiki_type= ?, home_page = ? WHERE wiki_id= ?';
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
	var qry = 'UPDATE wiki_type SET wiki_type= ?, wiki_parent_type = ? WHERE type_id= ?';
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
	var qry = 'INSERT INTO wiki_type (wiki_type, wiki_parent_type) VALUES (?, ?)';
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

var deleteWikiPage = function(params, callback) {
	var qry = 'UPDATE wiki SET wiki_active=0 WHERE wiki_id= ?';
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in deleteWikiPage query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getWikiHomepage = function(callback) {
	var qry = 'SELECT wiki.wiki_id, wiki.wiki_title, wiki.wiki_content, wiki.wiki_type, DATE_FORMAT( updated_date,  "%d %b %Y, %h:%i %p" ) AS updated_date';
		qry += ' FROM wiki AS wiki';
		qry += ' WHERE wiki.home_page =1 AND wiki.wiki_active = 1';	
		qry += ' ORDER BY wiki.updated_date DESC';	
		qry += ' LIMIT 0 , 1';	
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getWikiHomepage query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getAllParentWiki = function(callback) {
	var qry = 'SELECT type_id,wiki_parent_type,wiki_type FROM wiki_type WHERE is_deleted = 0 ORDER BY wiki_type ';
	
	connection.query(qry, function(err, rows, fields) {
		if (err) {
			console.log("Error in getAllParentWiki query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getWikiperType = function(params, callback) {
	var qry = 	"SELECT w.wiki_id,w.wiki_title,w.wiki_type, wt.wiki_type AS type FROM wiki w ";
		qry += 	"LEFT JOIN wiki_type wt ON w.wiki_type = wt.type_id ";
		qry += 	"WHERE w.wiki_type IN(?) AND w.wiki_active=1 AND w.home_page = 0 ORDER BY w.wiki_id DESC";

	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getWikiperType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getWikiperType_withHome = function(params, callback) {
	var qry = 	"SELECT w.wiki_id,w.wiki_title,w.wiki_type, wt.wiki_type AS type FROM wiki w ";
		qry += 	"LEFT JOIN wiki_type wt ON w.wiki_type = wt.type_id ";
		qry += 	"WHERE w.wiki_type IN(?) and w.wiki_active=1 order by w.wiki_id desc";

	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getWikiperType query ", err);
			callback(err);
		} else {
			callback('', rows);
		}
	})
}

var getUpdateWikiTypes = function(params, callback) {
	var qry = 'SELECT * FROM wiki_type WHERE type_id != ? AND is_deleted = 0 ';
	 
	connection.query(qry, params, function(err, rows, fields) {
		if (err) {
			console.log("Error in getUpdateWikiTypes query ", err);
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
exports.getAllWiki_withHome = getAllWiki_withHome;
exports.getRecentWiki_withHome = getRecentWiki_withHome;
exports.deleteWikiPage = deleteWikiPage;
exports.getAllParentWiki = getAllParentWiki; 
exports.getWikiperType = getWikiperType; 
exports.getUpdateWikiTypes = getUpdateWikiTypes; 
exports.getWikiperType_withHome = getWikiperType_withHome; 