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
var log = require('../lib/logger');
var config = require('../config/config');
var env = config.environment;
var apptitle = 'Wiki';

// home
router.get('/add', function(req, res) {
	if (req.session.loggedIn) {
		waterfall([
		    function(callback){       
				wikiModel.getAllWikiTypes(function executeSql(sqlErr1, rows1) {
					if (sqlErr1) {
						log.logger.error(sqlErr1);	
						callback(sqlErr1, '');
					} else {	
						callback(null, rows1);						
					}
				});
		    },	
		    function(rows1, callback){	
		    	groupModel.getAllGroups(function executeSql(sqlErr2, rows2) {
					if (sqlErr2) {
						log.logger.error(sqlErr2);	
						callback(sqlErr2, '');
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
								log.logger.error(sqlErr);	
								callback(sqlErr, '');
							} else {
								pager.count = rows[0].Count;
								callback(null, pager);
							}
						});				
					},			
					function(pager, callback) {
						pagination.paginate(pager, function(err, pager_obj, start){
							if (err) {
								log.logger.error(err);
								callback(err, '');
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
										log.logger.error(sqlErr);
										callback(sqlErr, '');
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
			function(callback){       
				wikiModel.getAllWikiTypes(function executeSql(sqlErr1, rows1) {
					if (sqlErr1) {						
						log.logger.error(sqlErr1);
						callback(sqlErr1, '');
					} else {	
						callback(null, rows1);						
					}
				});
			},	       
		    function(rows1, callback)   {
				if(req.session.user.role == 'admin'){
					method = wikiModel.getAllWiki_withHome;				
				}else{
					method = wikiModel.getAllWiki;
				}
				method(function executeSql(sqlErr2, rows2) {
					if (sqlErr2) {						
						log.logger.error(sqlErr2);
						callback(sqlErr2, '');
					} else {	
						callback(null, rows1, rows2);						
					}
				});
		    },    
		    function(rows1, rows2, callback){
		    	if(req.session.user.role == 'admin'){
					method = wikiModel.getRecentWiki_withHome;				
				}else{
					method = wikiModel.getRecentWiki;
				}
		    	method(function executeSql(sqlErr3, rows3) {
					if (sqlErr3) {						
						log.logger.error(sqlErr3);
						callback(sqlErr3, '');
					} else {	
						res.statusCode = 201;
						res.render('wiki/dashboard', {
							data : rows3,
							wiki_list : rows2,
							wiki_type : rows1,
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
		waterfall([
			function(callback){       
				wikiModel.getAllWikiTypes(function executeSql(sqlErr1, rows1) {
					if (sqlErr1) {						
						log.logger.error(sqlErr1);
						callback(sqlErr1, '');
					} else {	
						callback(null, rows1);						
					}
				});
			},	         
		    function(rows1, callback)   {
				if(req.session.user.role == 'admin'){
					method = wikiModel.getAllWiki_withHome;				
				}else{
					method = wikiModel.getAllWiki;
				}
		    	method(function executeSql(sqlErr2, rows2) {
					if (sqlErr2) {						
						log.logger.error(sqlErr2);
						callback(sqlErr2, '');
					} else {	
						callback(null, rows1, rows2);						
					}
				});
		    },    
		    function(rows1, rows2, callback){
		    	var params = [wikiId];	
		    	wikiModel.viewWiki(params, function executeSql(sqlErr3, rows3) {
					if (sqlErr3) {						
						log.logger.error(sqlErr3);
						callback(sqlErr3, '');
					} else {	
						callback(null, rows1, rows2, rows3);						
					}
				});
		    },
		    function(rows1, rows2, rows3, callback){    
		    	var params = [wikiId, req.session.user.id];
		    	wikiUsersModel.checkWikiUser(params, function executeSql(sqlErr4, rows4) {
					if (sqlErr4) {						
						log.logger.error(sqlErr4);
						callback(sqlErr4, '');
					} else {	
						callback(null, rows1, rows2, rows3, rows4);						
					}
				});
		    },
		    function(rows1, rows2, rows3, rows4, callback){
			    var params = [wikiId];
				wikiDocumentsModel.getWikiDocuments(params, function executeSql(sqlErr5, rows5) {
					if (sqlErr5) {						
						log.logger.error(sqlErr5);
						callback(sqlErr5, '');
					} else {	
						res.statusCode = 201;
						res.render('wiki/wikiview', {
							data : rows3[0],
							wiki_list : rows2,
							wiki_type : rows1,
							message : '',
							title : apptitle,
							is_wiki_user : rows4[0],
							wikiattchment : rows5,
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
		var params = [wikiId, req.session.user.id];
    	wikiUsersModel.checkWikiUser(params, function executeSql(sqlErr, result) {
			if (sqlErr) {			
				log.logger.error(sqlErr);
				callback(sqlErr, '');
				return;
			} else {	
				if(result[0].cnt == 0 && req.session.user.role != 'admin'){
					log.logger.error("User '"+ req.session.user.id + "' tried to edit non-permitted wiki page !!!");
					res.redirect('/wiki/dashboard');
				}
			}
		});
		waterfall([
					function(callback) {	
						var params = [wikiId];						
						wikiModel.viewWiki(params, function executeSql(sqlErr1, rows1) {													
							if (sqlErr1) {																
								log.logger.error(sqlErr1);
								callback(sqlErr1, '');
							} else {			
								callback(null, rows1);
							}
						});				
					},					
					function(rows1, callback) {
						wikiModel.getAllWikiTypes(function executeSql(sqlErr2, rows2) {
							if (sqlErr2) {								
								log.logger.error(sqlErr2);
								callback(sqlErr2, '');
							} else {
								callback(null, rows1, rows2);
							}		
						});							
					},
					function(rows1, rows2, callback){
						groupModel.getAllGroups(function executeSql(sqlErr3, rows3) {
							if (sqlErr3) {								
								log.logger.error(sqlErr3);
								callback(sqlErr3, '');
							} else {	
								callback(null, rows1, rows2, rows3);
							}								
						});										
					},
					function(rows1, rows2, rows3, callback){
					    var params = [wikiId];
						wikiDocumentsModel.getWikiDocuments(params, function executeSql(sqlErr4, rows4) {
							if (sqlErr4) {								
								log.logger.error(sqlErr4);
								callback(sqlErr4, '');
							} else {	
								callback(null, rows1, rows2, rows3, rows4);
							}								
						});										
					},
					function(rows1, rows2, rows3, rows4, callback){					
						var params = [wikiId];
						wikiUsersModel.getAllWikiUsers(params, function executeSql(sqlErr5, rows5) {
							if (sqlErr5) {								
								log.logger.error(sqlErr5);
								callback(sqlErr5, '');
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
				//logAndRespond(err, res);
				log.logger.error(err);
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

//Wiki page deletion
router.get('/:wiki_id/delete', function(req, res) {	 
	if (req.session.loggedIn) {
		var wikiId = req.params.wiki_id;	
		var params = [wikiId]; 
		wikiModel.deleteWikiPage(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);
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
				log.logger.error(err);
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
					if(req.body.wiki_id != '' && req.body.wiki_id != 'undefined'){  // Edit Wiki
						updateWiki(req, res, function(err,result){
							if (err) {								
								log.logger.error(err);
								callback(err, '');
							} 
							else{			
								callback(null, result);	
							}
						});	
					}	
					else{	// Create Wiki
						createWiki(req, res, function(err,result){
							if (err) {								
								log.logger.error(err);
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
					if(req.body.wiki_id != '' && req.body.wiki_id != 'undefined')
						wiki_id = rows1;
					else
						wiki_id = rows1.res2.insertId;

					var params = [wiki_id];
					wikiDocumentsModel.getWikiDocuments(params, function(err, wiki_docs){
						if (err) {							
							log.logger.error(err);
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
							log.logger.error(sqlErr);
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
										log.logger.error(error);
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
					//logAndRespond(error, res);
					log.logger.error(error);
					return;
		 		}
				else{
		 			// result now equals 'done'
					if(req.body.wiki_id == '' || req.body.wiki_id == 'undefined'){  // Only if new Wiki created
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
					else{
						res.redirect("/wiki/dashboard");
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
							log.logger.error(sqlErr1);
							callback(sqlErr1, '');
						} else {		
							var documentName = rows1[0].document_name;
							var filePath =  __dirname.replace("\controllers", "") + '/public/documents/' + documentName;			
							fs.unlink(filePath, function(err, result) {
								if (err) {								
									log.logger.error(err);
									callback(err, '');
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
							log.logger.error(sqlErr2);
							callback(sqlErr2, '');
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
	if (req.session.loggedIn && req.session.user.role == 'admin') { 
		var wikiId = req.params.wiki_id;
		var params = [wikiId];
		wikiModel.viewWiki(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {				
				log.logger.error(sqlErr);
				return;
			} else {
				res.statusCode = 201;				
				var title = rows[0].wiki_title;
				var posted= 'by '+rows[0].username;
				var updated = 'On '+rows[0].updated_on;
				var content = rows[0].wiki_content;			
				if(env === "development"){
					wkhtmltopdf.command = config[env].wkhtmltopdf_binPath;
				}
				wkhtmltopdf('<h1>'+title+'</h1><p>'+posted+'</p><p>'+updated+'</p><p>'+content+'</p>', { pageSize: 'letter' }).pipe(res);
				//wkhtmltopdf('http://localhost:3000/wiki/'+wikiId+'/view', { pageSize: 'letter' }).pipe(res);
			}
		});	
	} else {
		res.redirect('/');
	}
});

module.exports = router;

function createWiki(req, res, cb) {
	var data = req.body;
	if(data != ''){
		var title = data.title || '';
		var content = data.content || '';
		var wiki_type = data.wiki_type || '';
		var file = data.file || '';
		var page_users = data.page_users || '';
		var home_page = data.home_page || 0;
		var wikiattchment = '';
		
		var ts = String(Math.round(new Date().getTime() / 1000));			
		
		//If file path is selected
	     if(req.files.file){
	    	// get the temporary location of the file
	    	var original_name = req.files.file.originalname;
	 		var tmp_path = req.files.file.path;
	 		var fName = ts + "__"  + req.files.file.name;
	 		var fType = req.files.file.mimetype;
	      
	 		var validExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "csv", "txt", "rtf", "html", "zip"];  // allow this extension type only
			var ext = fName.split("."); // get the file extension
			if(validExtensions.indexOf(ext[1]) > 0 ){
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
			else {
				cb('Please upload a valid file', '');
			}	 		
	     }		
						
		 waterfall([
					function(callback) {
						wikiModel.getAllWikiTypes(function executeSql(sqlErr1, rows1) {
							currDate = new Date();
							if (sqlErr1) {								
								log.logger.error(sqlErr1);
								callback(sqlErr1, '');
							} else {									
								callback(null, rows1);
							}
						});	
					},	
					function(rows1, callback) {						
						var params = [title, content, currDate, req.session.user.id, wiki_type, home_page];
						wikiModel.addWikiPage(params, function executeSql(sqlErr2, rows2) {
							if (sqlErr2) {								
								log.logger.error(sqlErr2);
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
									log.logger.error(sqlErr3);
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
								log.logger.error(sqlErr4);
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
					     if(page_users.length > 0){ // If users/groups are selected
						     for(i=0; i < page_users.length; i++){
						    	 params.length = 0;
						    	 params.push(rows2.insertId, page_users[i]);	
						    	 
						    	 wikiUsersModel.addWikiUsers(params, function executeSql(sqlErr5,rows5) {					
									if (sqlErr5) {										
										log.logger.error(sqlErr5);
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
					     }
					     else{
					    	 var response = {res1 : rows1, res2: rows2, res3 : rows3, res4 : rows4, res5 : ''};
							 callback(null, response);	
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
	    var home_page = data.home_page || 0;
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
			
			var validExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "csv", "txt", "rtf", "html", "zip"];  // allow this extension type only
			var ext = fName.split("."); // get the file extension
			if(validExtensions.indexOf(ext[1]) > 0 ){
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
		    } else {
		    	cb('Please upload a valid file', '');
			}			
	    }	
	    
	    waterfall([
			function(callback) {
				if(req.files.file){	  //If file path is selected  	 
					 var rows1;
			    	 var params = [fName, original_name, fType, wiki_id, currDate, 1];				    	 
			    	 wikiModel.addWikiDocument(params, function executeSql(sqlErr1,rows1) {	
			    		if (sqlErr1) {
								//logAndRespond(sqlErr1, res);
			    				log.logger.error(sqlErr1);
								callback(sqlErr1, '');
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
				var params = [title, content, currDate, req.session.user.id,  wiki_type, home_page, wiki_id];
				wikiModel.updateWikiPage(params, function executeSql(sqlErr2,rows2) {
					if (sqlErr2) {						
						log.logger.error(sqlErr2);
						callback(sqlErr2, '');
					} else {
						callback(null, rows1,rows2);							
					}
				});							
			},
			function(rows1, rows2, callback) {
				//Delete existing users for current Wiki page				
				var params = [wiki_id];
			    wikiUsersModel.deleteWikiUsers(params, function executeSql(sqlErr3,rows3) {					
					if (sqlErr3) {						
						log.logger.error(sqlErr3);
						callback(sqlErr3, '');
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
							log.logger.error(sqlErr4);
							callback(sqlErr4, '');
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

router.get('/getTree', function(req, res) {
	waterfall([
			function(callback) {
				wikiModel.getAllParentWiki(function(err, results){
				if (err) return res.send(500, "getAllWikiTypes QUERY ERROR");
				else 
					callback(null, results);
				})
		    },						
			function(results, callback) {		    					
				var wikiTypeArr = [];
				for (i=0; i < results.length; i++) {										
					wikiTypeArr.push(results[i]['type_id']); 
				}	
								
				params = [wikiTypeArr];		
				
				if(req.session.user.role == 'admin'){
					method = wikiModel.getWikiperType_withHome;				
				}else{
					method = wikiModel.getWikiperType;
				}
				
				method(params, function(err, childtypes){								
					if (err) {
						return res.send(500, "getWikiperType QUERY ERROR");						
					}
					else { 
						if(childtypes.length > 0){ 	
							var childArr = [];
							for (j=0; j < childtypes.length; j++) {	
								var wikiId;
								wikiId = childtypes[j]['wiki_id'];
								childArr.push({
									"type_id": childtypes[j]['wiki_id'] + config.RAND_VAL, 
									"wiki_parent_type": childtypes[j]['wiki_type'], 
									"wiki_type": "<a href='/wiki/"+ wikiId +"/view'>"+ childtypes[j]['wiki_title'] +"</a>"
									});
																
							}	
							var treeData = results.concat(childArr);							
					    	var sortedquery = queryTreeSort({q:treeData});
					    	var tree = makeTree({q: sortedquery});				    					    
						}							
						callback(null, tree);
					}
				});									
			} ], function(err, result) {
				if(!err){						
					res.json(result);
				}	
			})
});

function queryTreeSort(options) {	
	  var cfi, e, i, id, o, pid, rfi, ri, thisid, _i, _j, _len, _len1, _ref, _ref1;
	  id = options.type_id || "type_id";
	  pid = options.wiki_parent_type || "wiki_parent_type";
	  	 
	  ri = [];
	  rfi = {};
	  cfi = {};
	  o = [];
	  _ref = options.q;
	  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
	    e = _ref[i];
	    rfi[e[id]] = i;
	    if (cfi[e[pid]] == null) {
	      cfi[e[pid]] = [];
	    }
	    cfi[e[pid]].push(options.q[i][id]);
	  }
	  _ref1 = options.q;
	  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	    e = _ref1[_j];
	    if (rfi[e[pid]] == null) {
	    	
	      ri.push(e[id]);
	    }
	    
	  }
	  while (ri.length) {
	    thisid = ri.splice(0, 1);
	    o.push(options.q[rfi[thisid]]);
	    if (cfi[thisid] != null) {
	      ri = cfi[thisid].concat(ri);
	    }
	  }
	  return o;
};

function makeTree(options) {
	  //console.log('opt',options);
	  var children, e, id, o, pid, temp, _i, _len, _ref;
	  id = options.type_id || "type_id";
	  pid = options.wiki_parent_type || "wiki_parent_type";
	  children = options.children || "children";
	  temp = {};
	  o = [];
	  _ref = options.q;
	  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	    e = _ref[_i];
	    e[children] = [];
	    temp[e[id]] = e;
	    if (temp[e[pid]] != null) {
	      temp[e[pid]][children].push(e);
	    } else {
	      o.push(e);
	    }
	  }
	  return o;
};