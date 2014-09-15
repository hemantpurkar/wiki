var express = require('express');
var router = express.Router();
var wikiModel = require('../models/wiki');
var log = require('../lib/logger');
var encoder = require('../lib/encoder');
var encode = encoder;

/* GET home page. */
var apptitle = 'Wiki';
router.get("/", function (req, res) {
	if (req.session.loggedIn) {
		res.redirect('/users/home'); 
	}
	else{		
		/*res.render('index', {
			title:apptitle,
			logged:'false',
			message_login:'',			
			wikitype:'',
		});*/
		//var params = [req.session.user.id];
		wikiModel.getWikiHomepage(function executeSql(sqlErr, rows) {			
			if (sqlErr) {
				//logAndRespond(sqlErr, res);
				log.logger.error(sqlErr);
				return;
			} else {					
				var wiki_content = '';
				wiki_content = encode.htmlDecode(rows[0].wiki_content);
				res.render('index', {
					wikitype:'',
					wiki_content : wiki_content,
					message_login : '',
					title : apptitle,
					page_message : '',
					logged:'false',
					session_user : '',		
				});					
			}
		});
	}
});

// LOGOUT
router.get('/logout', function (req, res) {
	// clear user session
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;