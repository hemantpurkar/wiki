var express = require('express');
var router = express.Router();

/* GET home page. */
var apptitle = 'Wiki';
router.get("/", function (req, res) {
	if (req.session.loggedIn) {
		res.redirect('/users/home'); 
	}
	else{
		res.render('index', {
			title:apptitle,
			logged:'false',
			message_login:'',			
			wikitype:'',
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