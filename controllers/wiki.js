var express = require('express');
var router = express.Router();
var wikiModel = require('../models/wiki');
var userModel = require('../models/user');
var wikiUsersModel = require('../models/wiki_users');
var wikiDocumentsModel=require('../models/wiki_documents');
var groupModel = require('../models/group');
var wikiattchment = '';
var waterfall = require('async-waterfall');
var pagination = require('../lib/pagination');
var fs = require('fs-extra');
var wkhtmltopdf = require('wkhtmltopdf');
var mail = require('../lib/email.js');
var transporter = mail.transporter;
var apptitle = 'Wiki';

// home
router.get('/add', function(req, res) {
	if (req.session.loggedIn) {
		waterfall([
		    function(callback){       
				wikiModel.getAllWikiTypes(function executeSql(sqlErr1, rows1) {
					if (sqlErr1) {
						logAndRespond(sqlErr1, res);
						return;
					} else {	
						callback(null, rows1);						
					}
				});
		    },	
		    function(rows1, callback){	
		    	groupModel.getAllGroups(function executeSql(sqlErr2, rows2) {
					if (sqlErr2) {
						logAndRespond(sqlErr2, res);
						return;
					} else {	
						res.statusCode = 201;
						res.render('wiki/wikipost', {
							data : '',
							message : '',
							title : apptitle,
							wikiattchment : '',
							page_message : 'Create',
							action : '/wiki/create',
							wikitype : rows1,
							groups : rows2,
							wiki_users : '',
							session_user : req.session.user
						});
						return;
					}								
				});										
				callback(null, 'done');
		    }
		 ], function(err, result) {
			// result now equals 'done'
		});		
	} else {
		res.redirect('/');
	}
});

// Wiki page list
router.get('/list/:page', function(req, res) {
	if (req.session.loggedIn) {
		waterfall([
					function(callback) {
						var pager = {
							'count' : 0,
							'currPage' : 1,
							'pager_view' : '',
							'pager_url' : '/wiki/list/',
							'requested_page' :  req.params.page,
							'limit' :  0
						};
						
						wikiModel.getWikiPagesCount(function executeSql(sqlErr, rows) {
							if (sqlErr) {
								logAndRespond(sqlErr, res);
								return;
							} else {
								pager.count = rows[0].Count;
								callback(null, pager);
							}
						});				
					},			
					function(pager, callback) {
						pagination.paginate(pager, function(err, pager_obj, start){
							if (err) {
								logAndRespond(err, res);
								return;
							} else {					
								callback(null, pager_obj, start);
							}
						});												
					},
					function(pager, start, callback) {
						var params = [start, pager.limit];			
						wikiModel.listWiki(params,
								function executeSql(sqlErr, rows) {
									if (sqlErr) {
										logAndRespond(sqlErr, res);
										return;
									} else {
										res.statusCode = 201;
										res.render('wiki/wikilist', {
											title : apptitle,
											data : rows,
											pager : pager,
											wikiattchment : '',
											page_message : '',
											session_user : req.session.user
										});
										return;
									}
								});
						// arg1 now equals 'three'
						callback(null, 'done');
					} ], function(err, result) {
				// result now equals 'done'
			});
	} else {
		res.redirect('/');
	}
});

//Wiki page list
router.get('/dashboard', function(req, res) {
	if (req.session.loggedIn) {		
		waterfall([
		    function(callback)   {
		    	wikiModel.getAllWiki(function executeSql(sqlErr1, rows1) {
					if (sqlErr1) {
						logAndRespond(sqlErr1, res);
						return;
					} else {	
						callback(null, rows1);						
					}
				});
		    },    
		    function(rows1, callback){
		    	wikiModel.getRecentWiki(function executeSql(sqlErr2, rows2) {
					if (sqlErr2) {
						logAndRespond(sqlErr2, res);
						return;
					} else {	
						res.statusCode = 201;
						res.render('wiki/dashboard', {
							data : rows2,
							wiki_list : rows1,
							message : '',
							title : apptitle,
							wikiattchment : '',
							page_message : '',
							session_user : req.session.user					
						});					
					}
					callback(null, 'done');
				});		    									
			}], function(err, result) {
			// result now equals 'done'
		});
				
	} else {
		res.redirect('/');
	}
});

//Wiki page list
router.get('/:wiki_id/view', function(req, res) {
	if (req.session.loggedIn) {
		var wikiId = req.params.wiki_id;
		var params = [wikiId];	
		waterfall([
		    function(callback)   {
		    	wikiModel.getAllWiki(function executeSql(sqlErr1, rows1) {
					if (sqlErr1) {
						logAndRespond(sqlErr1, res);
						return;
					} else {	
						callback(null, rows1);						
					}
				});
		    },    
		    function(rows1, callback){       
		    	wikiModel.viewWiki(params, function executeSql(sqlErr2, rows2) {
					if (sqlErr2) {
						logAndRespond(sqlErr2, res);
						return;
					} else {	
						callback(null, rows1, rows2);						
					}
				});
		    },	
		    function(rows1, rows2, callback){
			    var params = [wikiId];
				wikiDocumentsModel.getWikiDocuments(params, function executeSql(sqlErr3, rows3) {
					if (sqlErr3) {
						logAndRespond(sqlErr3, res);
						return;
					} else {	
						res.statusCode = 201;
						res.render('wiki/wikiview', {
							data : rows2[0],
							wiki_list : rows1,
							message : '',
							title : apptitle,
							wikiattchment : rows3,
							page_message : '',
							session_user : req.session.user,
							//action : '/wiki/:wiki_id/view',					
						});
					}	
					callback(null, 'done');
				});										
			}], function(err, result) {
			// result now equals 'done'
		});
				
	} else {
		res.redirect('/');
	}
});

//Wiki page edit-view
router.get('/:wiki_id/edit', function(req, res) {
	if (req.session.loggedIn) {
		var wikiId = req.params.wiki_id;
		waterfall([
					function(callback) {	
						var params = [wikiId];						
						wikiModel.viewWiki(params, function executeSql(sqlErr1, rows1) {													
							if (sqlErr1) {								
								logAndRespond(sqlErr1, res);
								return;
							} else {			
								callback(null, rows1);
							}
						});				
					},					
					function(rows1, callback) {
						wikiModel.getAllWikiTypes(function executeSql(sqlErr2, rows2) {
							if (sqlErr2) {
								logAndRespond(sqlErr2, res);
								return;
							} else {
								callback(null, rows1, rows2);
							}		
						});							
					},
					function(rows1, rows2, callback){
						groupModel.getAllGroups(function executeSql(sqlErr3, rows3) {
							if (sqlErr3) {
								logAndRespond(sqlErr3, res);
								return;
							} else {	
								callback(null, rows1, rows2, rows3);
							}								
						});										
					},
					function(rows1, rows2, rows3, callback){
					    var params = [wikiId];
						wikiDocumentsModel.getWikiDocuments(params, function executeSql(sqlErr4, rows4) {
							if (sqlErr4) {
								logAndRespond(sqlErr4, res);
								return;
							} else {	
								callback(null, rows1, rows2, rows3, rows4);
							}								
						});										
					},
					function(rows1, rows2, rows3, rows4, callback){					
						var params = [wikiId];
						wikiUsersModel.getAllWikiUsers(params, function executeSql(sqlErr5, rows5) {
							if (sqlErr5) {
								logAndRespond(sqlErr5, res);
								return;
							} else {				
								res.statusCode = 201;
								res.render('wiki/wikipost', {
									data : rows1[0],
									message : '',
									title : apptitle,
									wikiattchment : rows4,
									page_message : 'Edit',
									action : '/wiki/update',
									wikitype : rows2,
									groups : rows3,
									wiki_users : rows5,
									session_user : req.session.user
								});								
							}								
						});				
						callback(null, 'done');
					}], function(err, result) {
				// result now equals 'done'
			});	
	} else {
		res.redirect('/');
	}
});

//Wiki page update
router.post('/update', function(req, res) {
	if (req.session.loggedIn) {
		updateWiki(req, res, function(err,result){
			if (err) {
				logAndRespond(err, res);
				return;
			} 
			else{
				res.redirect('/wiki/dashboard');
			}
		});							        	    
	} else {
		res.redirect('/');
	}
});

// Create wiki page
router.post("/create",function(req, res) {
	if (req.session.loggedIn) {
		//Function all to create wiki page...
		createWiki(req, res, function(err,result){
			if (err) {
				logAndRespond(err, res);
				return;
			} 
			else{
				res.render('wiki/wikipost',
				{
					data : '',
					message : '<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Success!</h4>Wiki Page created successfully</div>',
					title : apptitle,
					wikiattchment : '',
					page_message : 'Create',
					action : '/wiki/create',
					wikitype : result.res1,
					groups : result.res4,
					wiki_users : result.res5,
					session_user : req.session.user
				});		
			}
		});		
	} else {
		res.redirect('/');
	}
});


//Share wiki page by Email
router.post("/share",function(req, res) {
	if (req.session.loggedIn) {	    
		waterfall([
				function(callback) {
					if(req.body.wiki_id != ''){  // Edit Wiki
						updateWiki(req, res, function(err,result){
							if (err) {
								logAndRespond(err, res);
								return;
							} 
							else{
								callback(null, result);	
							}
						});	
					}	
					else{	// Create Wiki
						createWiki(req, res, function(err,result){
							if (err) {
								logAndRespond(err, res);
								callback(err, '');
								return;
							} 
							else{	
								callback(null, result);	
							}
						});
					}
				},	
				function(rows1, callback) {
					if(req.body.wiki_id != '')
						wiki_id = rows1;
					else
						wiki_id = result.insertId;
					
					var params = [wiki_id];
					wikiDocumentsModel.getWikiDocuments(params, function(err, wiki_docs){
						if (err) {
							logAndRespond(err, res);
							callback(err, '');
							return;
						} 
						else{	
							callback(null, rows1, wiki_docs);	
						}
					});
				},
				function(rows1, wiki_docs, callback) {	
					var params = [req.body.page_users];					    	 
					groupModel.getGroupInfo(params, function executeSql(sqlErr,groupInfo) {					
						if (sqlErr) {
							logAndRespond(sqlErr, res);
							callback(sqlErr, '');
							return;
						} 
						else{
							if(groupInfo.length > 0){
								flag = true;
								var body = req.body.content; 
								var subject = req.body.title; // Send wiki title as mail subject 
								
								//create attachment array
								var attachment_arr = [];
								if(wiki_docs.length > 0)								
								for(i=0;i<wiki_docs.length;i++){
									attachment_arr.push({
										filename : wiki_docs[i].original_name,
										path : __dirname.replace("\controllers", "") + '/public/documents/' + wiki_docs[i].document_name										
									});									
								}
								
								////Create recepient array(to)
								var recepients = [];
								for(i=0;i<groupInfo.length;i++){
									recepients.push(groupInfo[i].group_email)
								}	
								
								transporter.sendMail({
									from : mail.from_email, //default "from" var. created in email config
									to : recepients,
									cc : mail.admin_email,  //default "admin" var. created in email config
									subject : subject,
									html : body,
									attachments : attachment_arr
								},function(error, info) {
									if (error) {								
										logAndRespond(error, res);
										return;
									}
								});								
								callback(null, rows1);
							}
							else{
								callback('Email can not be send', '');	
							}	
						}
				     })
			}], function(err, result) {
				if(err){
					logAndRespond(error, res);
					return;
		 		}
				else{
		 			// result now equals 'done'
					if(req.body.wiki_id == ''){  // Only if new Wiki created
						res.redirect('/wiki/dashboard');
						res.render('wiki/wikipost',{
							data : '',
							message : '<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Success!</h4>Wiki Page created successfully</div>',
							title : apptitle,
							wikiattchment : '',
							page_message : '',
							action : '/wiki/create',
							wikitype : result.res1,
							groups : result.res4,
							wiki_users : result.res5,
							session_user : req.session.user
						});	
					}					
		 		}					
		});		
	} else {
		res.redirect('/');
	}
});

//Download attachment
router.get('/download/:filename', function(req, res) { 
    var path = __dirname.replace("\controllers", "") +'/public/documents/' + req.params.filename;
	res.download(path);	
});

//Delete attachment
router.get('/deleteAttachment/:doc_id', function(req, res) { 
	if (req.session.loggedIn) {
		 var documentId = req.params.doc_id;		
		 waterfall([
				function(callback) {
					var params = [documentId];
					wikiDocumentsModel.getDocumentDetails(params, function executeSql(sqlErr1, rows1) {
						if (sqlErr1) {
							logAndRespond(sqlErr1, res);
							return;
						} else {		
							var documentName = rows1[0].document_name;
							var filePath =  __dirname.replace("\controllers", "") + '/public/documents/' + documentName;			
							fs.unlink(filePath, function(err, result) {
								if (err) {
									logAndRespond(err, res);
									return;
								}
								else{
									callback(null, rows1);
								}			 					   
			 				});							
						}
					});	
				},	
				function(rows1, callback) {
					var wikiId = rows1[0].wiki_id;
					var params = [documentId, rows1[0].wiki_id];
					wikiDocumentsModel.deleteWikiDocument(params,function executeSql(sqlErr2,rows2) {
						if (sqlErr2) {
							logAndRespond(sqlErr2,res);
							return;
						} else {
							callback(null, 'done');
							res.redirect('/wiki/'+ wikiId +'/edit');
						}
					});								
			}], function(err, result) {
		// result now equals 'done'
		});					
	} else {
		res.redirect('/');
	}
});

//Wiki page export
router.get('/:wiki_id/pdf', function(req, res) {
	if (req.session.loggedIn) { 
		var wikiId = req.params.wiki_id;
		var params = [wikiId];
		wikiModel.viewWiki(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				logAndRespond(sqlErr, res);
				return;
			} else {
				res.statusCode = 201;				
				var title = rows[0].wiki_title;
				var posted= 'by '+rows[0].username;
				var updated = 'Posted on '+rows[0].updated_date;
				var content = rows[0].wiki_content;				
				wkhtmltopdf.command = 'C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe';
				wkhtmltopdf('<h1>'+title+'</h1><p>'+posted+'</p><p>'+updated+'</p><p>'+content+'</p>', { pageSize: 'letter' }).pipe(res);
				//wkhtmltopdf('http://localhost:3000/wiki/'+wikiId+'/view', { pageSize: 'letter' }).pipe(res);
			}
		});	
	} else {
		res.redirect('/');
	}
});

module.exports = router;

var logAndRespond = function logAndRespond(err, res, status) {
	console.error(err);
	res.statusCode = ('undefined' === typeof status ? 500 : status);
	res.send({
		result : 'error',
		err : err.code
	});
};

function createWiki(req, res, cb) {
	var data = req.body;
	if(data != ''){
		var title = data.title || '';
		var content = data.content || '';
		var wiki_type = data.wiki_type || '';
		var file = data.file || '';
		var page_users = data.page_users || '';
		//var home_page = data.home_page || '';
		var wikiattchment = '';
		
		var ts = String(Math.round(new Date().getTime() / 1000));			
		
		//If file path is selected
	     if(req.files.file){
	    	// get the temporary location of the file
	    	var original_name = req.files.file.originalname;
	 		var tmp_path = req.files.file.path;
	 		var fName = ts + "__"  + req.files.file.name;
	 		var fType = req.files.file.mimetype;
	      
	 		if(req.files.file.name !=''){
	 			// set where the file should actually exists - in this case it is in the "images" directory
	 			var target_path = './public/documents/' + fName;
	 			// move the file from the temporary location to the intended location
	 			fs.rename(tmp_path, target_path, function(err) {
	 				if (err) throw err;
	 				 // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
	 				fs.unlink(tmp_path, function() {
	 					if (err) throw err;
	 					   
	 				});
	 			});
	 			
	 		}
	     }		
						
		 waterfall([
					function(callback) {
						wikiModel.getAllWikiTypes(function executeSql(sqlErr1, rows1) {
							currDate = new Date();
							if (sqlErr1) {
								logAndRespond(sqlErr1, res);
								callback(sqlErr1, '');
							} else {									
								callback(null, rows1);
							}
						});	
					},	
					function(rows1, callback) {
						var params = [title, content, currDate, req.session.user.id, wiki_type];
						wikiModel.addWikiPage(params, function executeSql(sqlErr2, rows2) {
							if (sqlErr2) {
								logAndRespond(sqlErr2,res);
								callback(sqlErr2, '');
							} else {
								callback(null, rows1, rows2);
							}	
						});	
					},	
					function(rows1, rows2, callback) {	
						//Add Wiki documents data 
						var rows3;
						if(req.files.file){
							var params = [fName, original_name, fType, rows2.insertId, currDate, 1];
							wikiModel.addWikiDocument(params,function executeSql(sqlErr3,rows3) {
								if (sqlErr3) {
									logAndRespond(sqlErr3,res);
									callback(sqlErr3, '');
								} else {
									callback(null, rows1, rows2, rows3);
								}
							});	
						}
						else{
							callback(null, rows1, rows2, rows3);
						}
					},
					function(rows1, rows2, rows3, callback){	
						//Fetch all users
						groupModel.getAllGroups(function executeSql(sqlErr4, rows4) {
							if (sqlErr4) {
								logAndRespond(sqlErr4, res);
								callback(sqlErr4, '');
							} else {	
								callback(null, rows1, rows2, rows3, rows4);
							}								
						});																
				    },
					function(rows1, rows2, rows3, rows4, callback) {
						//Assign selected users for current Wiki page
						 var rows5 = '';
					     var params = [];
					     for(i=0; i < page_users.length; i++){
					    	 params.length = 0;
					    	 params.push(rows2.insertId, page_users[i]);	
					    	 
					    	 wikiUsersModel.addWikiUsers(params, function executeSql(sqlErr5,rows5) {					
								if (sqlErr5) {
									logAndRespond(sqlErr5, res);
									callback(sqlErr5, '');									
								} 
								else{																			
									//return response;
									if(i==page_users.length){
										var response = {res1 : rows1, res2: rows2, res3 : rows3, res4 : rows4, res5 : rows5};
										callback(null, response);										
									}
								}
						     });	
					     }							    
					}], function(err, result) {
			 		// result now equals 'done'
			 		if(err){
			 			cb(err, '');
			 		}else{
			 			cb('', result);
			 		}			 		
			});	
	}
};

function updateWiki(req, res, cb) { 
	var data = req.body;
	if(data != ''){
		var data = req.body; 
	    var title  = data.title || '';
	    var content  = data.content || '';
	    var wiki_id  = data.wiki_id || '';
	    var wiki_type  = data.wiki_type || '';
	    var file  = data.file || '';
	    //var home_page = data.home_page || '';
	    var page_users = data.page_users || '';
	    var currDate = new Date();
	    if(title == '' || content == ''){
		    res.redirect('/wiki/'+wiki_id+'/edit');
		    return;
	    }	    
	    
	    var ts = String(Math.round(new Date().getTime() / 1000));
	    
	    //If file path is selected
	    if(req.files.file){
			// get the temporary location of the file
	    	var original_name = req.files.file.originalname;	     	
			var tmp_path = req.files.file.path;
			var fName = ts+"__"+req.files.file.name;
			var fType = req.files.file.mimetype;
			 
				if(req.files.file.name !=''){
				// set where the file should actually exists - in this case it is in the "images" directory
				var target_path = './public/documents/' + fName;
				// move the file from the temporary location to the intended location
				fs.rename(tmp_path, target_path, function(err) {
					if (err) throw err;
					 // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
					fs.unlink(tmp_path, function() {
						if (err) throw err;						   
					});
				});				
			}	
	    }		    
	    waterfall([
			function(callback) {
				if(req.files.file){	  //If file path is selected  	 
					 var rows1;
			    	 var params = [fName, original_name, fType, wiki_id, currDate, 1];				    	 
			    	 wikiModel.addWikiDocument(params, function executeSql(sqlErr1,rows1) {	
			    		if (sqlErr1) {
								logAndRespond(sqlErr1, res);
								return;
						} else {
								callback(null, rows1);
						}
					});
				 }	 
				else{
					callback(null, rows1);
				}
			},	
			function(rows1, callback) {
				//Edit Wiki page with updated data
				var params = [title, content, currDate, req.session.user.id,  wiki_type, wiki_id];
				wikiModel.updateWikiPage(params, function executeSql(sqlErr2,rows2) {
					if (sqlErr2) {
						logAndRespond(sqlErr2, res);
						return;
					} else {
						callback(null, rows1,rows2);
						res.redirect('/wiki/dashboard'); 							
					}
				});							
			},
			function(rows1, rows2, callback) {
				//Delete existing users for current Wiki page				
				var params = [wiki_id];
			    wikiUsersModel.deleteWikiUsers(params, function executeSql(sqlErr3,rows3) {					
					if (sqlErr3) {
						logAndRespond(sqlErr3, res);
						return;
					} 
					else{
						callback(null, rows1, rows2, rows3);
					}
				 });						
			},
			function(rows1, rows2, rows3, callback) {
				//Assign selected users for current Wiki page	
			     var params = [];
			     for(i=0; i < page_users.length; i++){
			    	 params.length = 0;
			    	 params.push(wiki_id, page_users[i]);					    	 
			    	 wikiUsersModel.addWikiUsers(params, function executeSql(sqlErr4,rows4) {					
						if (sqlErr4) {
							logAndRespond(sqlErr4, res);
							return;
						} 
						else{
							if(i == page_users.length)
							return;
						}
				     })
			     }	
			     callback(null, wiki_id);
			} ], function(err, result) {
	    	// result now equals 'done'
	    	if(err){
	 			cb(err, '');
	 		}else{
	 			cb('', result);
	 		}		
		});
	}
}