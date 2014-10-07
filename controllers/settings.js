var express = require('express');
var router = express.Router();
var wikiModel = require('../models/wiki');
var eventModel = require('../models/event');
var userModel = require('../models/user');
var groupModel = require('../models/group');
var groupUsersModel = require('../models/group_users');
var waterfall = require('async-waterfall');
var pagination = require('../lib/pagination');
var log = require('../lib/logger');
var config = require('../config/config');
var trim = require('trim');
var async = require('async');
var apptitle = 'Wiki';

//Load add user page
router.get('/addUser', function(req, res) {
	if (req.session.loggedIn) {
		err_msg = "";
		redirectAddUser(req, res, 'settings/add_user', null, 'Add', err_msg);
	}
});

//Load edit user page
router.get('/:userId/editUser', function(req, res) {
	if (req.session.loggedIn) {
	    var userId  = req.params.userId;
	    var conditions = 'id = "' + [userId] + '"';
	    // Get user information
		userModel.getUser(conditions, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);	
				return;
			} else {				
				redirectAddUser(req, res, 'settings/edit_user', rows[0], 'Edit', null);  
			}
		});
		
	} else {
		res.redirect('/');
	}	
});

//Save user information
router.post('/saveUser', function(req, res) {	
	if (req.session.loggedIn) {		
		var data = req.body;
		var email = data.email || '';
		var isAdmin = data.isAdmin;
		var userId = data.userId || '';
		var userInfo;		
		var action = (userId) ? 'Edit' : 'Add'; 
		var username = email.split("@")[0];

	    // If any of the inputs is blank
	    if (email == '') {
	    	redirectAddUser(req, res, 'settings/add_user', null, action, 'Email can not be blank !!!');  
	    }
	    else {	    	
	    	//Get user info. from activedir... Check user in both pune and chennai location
			async.series({
				puneResult : function (callback){
					config.adPune.findUser(username, function(adPuneErr, puneUser) {						
						if (adPuneErr) {
							log.logger.error(adPuneErr);    									
						    console.log('adPune ERROR: ' +JSON.stringify(adPuneErr));
						    return;
						}									
					    callback(null, puneUser);  								
					});						  
				},
				chennaiResult : function (callback){
					config.adChennai.findUser(username, function(adChennaiErr, chennaiUser) {
						if (adChennaiErr) {
							log.logger.error(adChennaiErr);    									
						    console.log('adChennai ERROR: ' +JSON.stringify(adChennaiErr));
						    return;
						}						
					    callback(null, chennaiUser);  								
					});						  
				},      	
			}, function(err, results) {
				if (err) {
					log.logger.error(err);    												    
				    return;
				}
				else{
					var userResults;
					if(results.puneResult){
						userResults = results.puneResult;
					}
					else if(results.chennaiResult) {
						userResults = results.chennaiResult; 
					}
				
					if(userResults){  // If user exists in pune or chennai
						//Insert into users table 
						userInfo = userResults;
						var params = [userInfo.mail];
						if(userId) { // If edit user...only update user information
							var params = [userInfo.employeeID, userInfo.displayName, isAdmin, userInfo.mail];
	  						userModel.updateUser(params, function executeSql(err, rows){
			  	  				if (err){     	   
			  	  					log.logger.error(err);
			  	  					return;
			  	  				}  								  		  						  		  	
			  		  			res.redirect('/settings/listUsers/0'); 
			  	  			});
						}
						else{ // New user .. insert into user table 
							var params = [email];
							userModel.checkUserExists_byEmail(params, function executeSql(err, rows){ 			  				
				  				if (err){     	   
				  					log.logger.error(err);
				  					return;
				  				}  			
				  				else{
				  					if(rows.length > 0){ 
				  						redirectAddUser(req, res, 'settings/add_user', null, action, 'User already registered !!!');		  						
				  					}	
				  					else{
				  						var params = [userInfo.employeeID, userInfo.displayName, userInfo.mail, isAdmin];
				  						userModel.addUser(params, function executeSql(err, rows){
						  	  				if (err){     	   
						  	  					log.logger.error(err);
						  	  					return;
						  	  				}  								  		  						  		  	
						  		  			res.redirect('/settings/listUsers/0'); 
						  	  			});
				  					}
				  				}	  				
				  			});
						}						
					}						
					else{	// If user is not found redirect to add user page
						redirectAddUser(req, res, 'settings/add_user', null, action, 'User does not exist with Smartek !!!');					
					}
				} 			
			});		
		}
	}   
});

//Create event type page
router.get('/createEventType', function(req, res) {
	if (req.session.loggedIn) {	     
		res.render('settings/event_type_post', {
            title: apptitle,
            message: '',
            page_message: 'Create',
            data:'',
            wikitype:'',
            action:'/settings/saveEventType',
            session_user : req.session.user
        });
		
	} else {
		res.redirect('/');
	}
});

//Save event type 
router.post('/saveEventType', function(req, res) {
	if (req.session.loggedIn) {
		 var data = req.body;
	     var title  = data.title || '';
	     var color  = data.color || '';
	     
		var params = [title,color];
		eventModel.createEventType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);	
				return;
			} else {
				res.redirect('/settings/eventTypes/0');
				return;
			}
		});
		
	} else {
		res.redirect('/');
	}
});

//delete event type 
router.get('/:event_type_id/deleteEventType', function(req, res) {
	if (req.session.loggedIn) {
	    var type_id  = req.params.event_type_id;
	    var params = [type_id];
	    // Soft delete event type
		eventModel.deleteEventType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);	
				return;
			} else {
				res.redirect('/settings/eventTypes/0');
				return;
			}
		});
		
	} else {
		res.redirect('/');
	}
});

// event type listing
router.get("/eventTypes", function(req, res) {
	if (req.session.loggedIn) {		
		eventModel.getAllEventTypes(function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);	
				return;
			} else {
				res.send(rows);
			}
		});
	} else {
		res.redirect('/');
	}	
	
});

//Edit event type view 
router.get('/:event_id/editevent', function(req, res) {
	if (req.session.loggedIn) {
		var eventId = req.params.event_id;
		var params = [eventId];
		eventModel.getEventType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);	
				return;
			} else {
				res.statusCode = 201;
				res.render('settings/event_type_post', {
					data : rows[0],
					message : '',
					title : apptitle,
					wikiattchment : '',
					page_message : 'Edit',
					action : '/settings/update_eventType',	
					session_user : req.session.user
				});
				return;
			}
		});
		
	} else {
		res.redirect('/');
	}
});

//Edit event type 
router.post('/update_eventType', function(req, res) {
	if (req.session.loggedIn) {
		 var data = req.body;
	     var title  = data.title || '';
	     var type_id  = data.event_type_id || '';
	     var color  = data.color || '';
	     
		var params = [title, color, type_id];
		eventModel.updateEventType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);	
				return;
			} else {
				res.redirect('/settings/eventTypes/0');
				return;
			}
		});
		
	} else {
		res.redirect('/');
	}
});

//Create wiki type page
router.get('/createWikiType', function(req, res) {
	if (req.session.loggedIn) {		
		wikiModel.getAllParentWiki(function executeSql(sqlErr1, rows1) {
			if (sqlErr1) {
				log.logger.error(sqlErr1);	
				return;
			} else {	
				res.render('settings/wiki_type_post', {
					title : apptitle,
					message : '',					
					page_message : 'Create',
					data : '',
					action : '/settings/saveWikiType',		
					parent : rows1,
					session_user : req.session.user
				});
				return;					
			}
		});
	} else {
		res.redirect('/');
	}
});

//Save wiki type 
router.post('/saveWikiType', function(req, res) {
	if (req.session.loggedIn) {
		var data = req.body;
	    var title  = data.title || '';
		var parent = data.wiki_parent || '';
	     
		var params = [title,parent];
		wikiModel.createWikiType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);	
				return;
			} else {
				res.redirect('/settings/wikiTypes/0');
				return;
			}
		});
		
	} else {
		res.redirect('/');
	}
});

//Edit wiki type view 
router.get('/:wikiTypeId/editWikiType', function(req, res) {
	if (req.session.loggedIn) {
		var wikiTypeId = req.params.wikiTypeId;
		var params = [wikiTypeId];
		waterfall([
		    function(callback){       
				wikiModel.getWikiType(params, function executeSql(sqlErr1, rows1) {
					if (sqlErr1) {
						log.logger.error(sqlErr1);	
						callback(sqlErr1, '');
					} else {	
						callback(null, rows1);						
					}
				});
		    },	
		    function(rows1, callback){	
		    	wikiModel.getUpdateWikiTypes(params, function executeSql(sqlErr2, rows2) {
					if (sqlErr2) {
						log.logger.error(sqlErr2);	
						callback(sqlErr2, '');
					} else {	
						res.statusCode = 201; 
						res.render('settings/wiki_type_post', {
							data : rows1[0],
							message : '',
							title : apptitle,
							wikiattchment : '',
							page_message : 'Edit',
							action : '/settings/update_wikiType',
							parent : rows2,
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

//Edit event type 
router.post('/update_wikiType', function(req, res) {
	if (req.session.loggedIn) {
		var data = req.body;
	    var title  = data.title || '';
		var parent = data.wiki_parent || '';
		var type_id  = data.wiki_type_id || '';

		var params = [title, parent, type_id];
		wikiModel.updateWikiType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);	
				return;
			} else {
				res.redirect('/settings/wikiTypes/0');
				return;
			}
		});
		
	} else {
		res.redirect('/');
	}
});

//delete wiki type 
router.get('/:wikiTypeId/deleteWikiType', function(req, res) {
	if (req.session.loggedIn) {
	     var type_id  = req.params.wikiTypeId;
		var params = [type_id];
		// Soft delete wiki type
		wikiModel.deleteWikiType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				log.logger.error(sqlErr);	
				return;
			} else {
				res.redirect('/settings/wikiTypes/0');
				return;
			}
		});
		
	} else {
		res.redirect('/');
	}
});

//wiki type listing
router.get("/wikiTypes/:page", function(req, res) {	
	waterfall([
			function(callback) {
				var pager = {
					'count' : 0,
					'currPage' : 1,
					'pager_view' : '',
					'pager_url' : '/settings/wikiTypes/',
					'requested_page' :  req.params.page,
					'limit' :  0
				};
				
				wikiModel.getWikiTypeCount(function executeSql(sqlErr, rows) {
					if (sqlErr) {
						log.logger.error(sqlErr);	
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
						log.logger.error(err);	
						return;
					} else {					
						callback(null, pager_obj, start);
					}
				});												
			},
			function(pager, start, callback) {
				var params = [start, pager.limit];			
				wikiModel.getWikiTypes(params,
						function executeSql(sqlErr, rows) {
							if (sqlErr) {
								log.logger.error(sqlErr);	
								return;
							} else {
								res.statusCode = 201;
								res.render('settings/wiki_type_list', {
									title : apptitle,
									data : rows,
									pager : pager,
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

});

//event type listing
router.get("/eventTypes/:page", function(req, res) {	
	waterfall([
			function(callback) {
				var pager = {
					'count' : 0,
					'currPage' : 1,
					'pager_view' : '',
					'pager_url' : '/settings/eventTypes/',
					'requested_page' :  req.params.page,
					'limit' :  0
				};
				
				eventModel.getEventTypeCount(function executeSql(sqlErr, rows) {
					if (sqlErr) {
						log.logger.error(sqlErr);	
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
						log.logger.error(err);	
						return;
					} else {					
						callback(null, pager_obj, start);
					}
				});												
			},
			function(pager, start, callback) {
				var params = [start, pager.limit];			
				eventModel.getEventTypes(params,
						function executeSql(sqlErr, rows) {
							if (sqlErr) {
								log.logger.error(sqlErr);	
								return;
							} else {
								res.statusCode = 201;
								res.render('settings/event_type_list', {
									title : apptitle,
									data : rows,
									pager : pager,
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

});

//Create User Group
router.get('/createUserGroup', function(req, res) {
	if (req.session.loggedIn) {
		res.render('settings/group_create', {
			data : '',
			groupId : '',
			message : '',
			title : apptitle,			
			page_message : 'Create',
			action : '/settings/saveGroup',		
			users : '',
			group_users : '',
			session_user : req.session.user
		});
		
	} else {
		res.redirect('/');
	}
});


//Save wiki type - For both Add and Update 
router.post('/saveGroup', function(req, res) {
	if (req.session.loggedIn) {
		var data = req.body;
	    var group_name  = trim(data.group_name) || '';
	    var currDate = new Date();
	    var group_users = trim(data.group_users) || '';
	    var group_lead = trim(data.group_lead) || '';
	    var user_group_id = trim(data.user_group_id) || '';
	    var group_email = trim(data.group_email) || '';	    	    	

	    waterfall([
	   			function(callback) {	
	   				var rows1;
	   				if(user_group_id == ''){ // New Insert.. Add group		   				
	   			    	 var params = [group_name, group_email, req.session.user.id, currDate, currDate];				    	 
	   			    	 groupModel.addGroup(params, function executeSql(sqlErr1,rows1) {	
	   			    		if (sqlErr1) {	   	
	   			    				log.logger.error(sqlErr1);	
	   								return;
	   						} else {
	   								user_group_id = rows1.insertId;
	   								callback(null, user_group_id);
	   						}
	   					}); 
	   				}
		   			else{	//Update group		   				
	   			    	 var params = [group_name, group_email, currDate, user_group_id];				    	 
	   			    	 groupModel.updateGroup(params, function executeSql(sqlErr1,rows1) {	
	   			    		if (sqlErr1) {
	   			    				log.logger.error(sqlErr1);	
	   								return;
	   						} else {
		   							//Delete existing users from group		
		   			   				var params = [user_group_id];
		   			   				groupUsersModel.deleteGroupUsers(params, function executeSql(sqlErr2,rows2) {					
		   			   					if (sqlErr2) {
		   			   						log.logger.error(sqlErr2);	
		   			   						return;
		   			   					} 
		   			   					else{
		   			   						callback(null, user_group_id);
		   			   					}
		   			   				});		   								
	   						}
	   					});		   				
		   			}
	   			},	
	   			function(user_group_id, callback) {	 
	   				console.log("group_users:::",group_users);
	   				if(group_users != ""){
		   				//Get user id from database for the selected group users
		   				var emails = extractEmails(group_users).join(',');
						var params = [emails.split(',')];
						var cnt =0;
				    	userModel.getEmployeeId(params, function executeSql(sqlErr3, groupMembers) {					
							if (sqlErr3) {
								log.logger.error(sqlErr3);	
								return;
							} 
							else{
								if(groupMembers.length > 0){
							    	for(i=0; i < groupMembers.length; i++){
							    	 params.length = 0;
							    	 params.push(groupMembers[i].id, user_group_id);
							    	 groupUsersModel.addGroupUsers(params, function executeSql(sqlErr4,resp) {
					   					if (sqlErr4) {
					   						log.logger.error(sqlErr4);	
					   						return;
					   					} else {
					   						cnt++;
					   						if(cnt == groupMembers.length){ 
					   							callback(null, user_group_id, groupMembers);	
					   						}
					   					}
							    	 });
							    	} 
							    }			
							}
						 });	
	   				}	
	   				else{
	   					callback(null, user_group_id, null);
	   				}
	   			},
	   			function(user_group_id, groupMembers, callback) {	 
	   				//Get user id from database for the selected group lead
	   				if(group_lead != ""){
		   				var emails = extractEmails(group_lead).join(',');
						var params = [emails.split(',')];
						var cnt = 0;
				    	userModel.getEmployeeId(params, function executeSql(sqlErr5, groupLead) {		
							if (sqlErr5) {
								log.logger.error(sqlErr5);	
								return;
							} 
							else{	
								if(groupLead.length > 0){							
							    	for(i=0; i < groupLead.length; i++){						    	
							    		//Check if the current user added into the database
							    		var params = [groupLead[i].id, user_group_id];
							    		groupUsersModel.checkUserExists(params, function executeSql(sqlErr6, leadExists) {					
										if (sqlErr6) {
											log.logger.error(sqlErr6);	
											return;
										} 
										else{
											if(leadExists.length > 0){ 								
								    			//If current user already added into database, update with is_lead = 1						    			
						   						groupUsersModel.setGroupLead(params, function executeSql(sqlErr6,rows6) {					
						   	   						if (sqlErr6) {
						   	   							log.logger.error(sqlErr6);	
						   	   							return;
						   	   						} 
						   	   						else{
						   	   							res.redirect('/settings/listGroups/0');		   	   							
						   	   						}
						   	   				     });
								    		}
								    		else{ 
								    			//If current user not added into database, insert with is_lead = 1
								    			groupUsersModel.addGroupLeads(params, function executeSql(sqlErr7,rows7) {
								   					if (sqlErr7) {
								   						log.logger.error(sqlErr7);	
								   						return;
								   					} else {
								   						cnt++;
								   						if(cnt == groupLead.length){
								   							callback(null, 'done');	
								   						}
								   					}
										    	});
								    		}
										}							    								    		
							    	});
							    }		
							  }
							}	
				    	});   
	   				}	
	   				else{
	   					callback(null, 'done');	
	   				}
	   			}], function(err, result) {
	    				if(!err){
	    					res.redirect('/settings/listGroups/0');	
	    				}
			});				   			     
	} else {
		res.redirect('/');
	}
});

//Create User Group
router.get('/:group_id/deleteUserGroup', function(req, res) {
	if (req.session.loggedIn) {   	
		var params = [req.params.group_id];
		// Soft delete current group
		groupModel.deleteGroup(params, function executeSql(sqlErr1, rows1) {
			if (sqlErr1) {
				log.logger.error(sqlErr1);	
				return;
			} else {	
				res.redirect('/settings/listGroups/0');						
			}
		});
		
	} else {
		res.redirect('/');
	}
});

//user group listing
router.get("/listGroups/:page", function(req, res) {	
	waterfall([
			function(callback) {
				var pager = {
					'count' : 0,
					'currPage' : 1,
					'pager_view' : '',
					'pager_url' : '/settings/listGroups/',
					'requested_page' :  req.params.page,
					'limit' :  0
				};
				
				groupModel.getGroupCount(function executeSql(sqlErr, rows) {
					if (sqlErr) {
						log.logger.error(sqlErr);	
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
						log.logger.error(err);	
						return;
					} else {					
						callback(null, pager_obj, start);
					}
				});												
			},
			function(pager, start, callback) {
				var params = [start, pager.limit];
				groupModel.getGroupList(params,
						function executeSql(sqlErr, rows) {
							if (sqlErr) {
								log.logger.error(sqlErr);	
								return;
							} else {
								res.statusCode = 201;
								res.render('settings/group_list', {
									title : apptitle,
									data : rows,
									pager : pager,
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

});

//Edit group
router.get('/:group_id/editUserGroup', function(req, res) {
	if (req.session.loggedIn) {   
		var groupId = req.params.group_id;
		
		waterfall([
			function(callback){  
				var params = [groupId];
				//get current group information
				groupModel.getGroupInfo(params, function executeSql(sqlErr1, groupName) {
					if (sqlErr1) {
						log.logger.error(sqlErr1);	
						return;
					} else {	
						callback(null, groupName);						
					}
				});
			},	       
		    function(groupName, callback){  
		    	var params = [groupId];
		    	//get all users belonging to the current group
		    	groupUsersModel.getGroupUsers(params, function executeSql(sqlErr2, groupUsers) {
					if (sqlErr2) {
						log.logger.error(sqlErr2);	
						return;
					} else {	
						res.statusCode = 201;
						res.render('settings/group_create', {
							data : groupName[0],
							groupId : groupId,
							message : '',
							title : apptitle,			
							page_message : 'Create',
							action : '/settings/saveGroup',	
							group_users : groupUsers,
							session_user : req.session.user
						});
						return;					
					}
				});
		    	callback(null, 'done');
		    },			   
		 ], function(err, result) {
			// result now equals 'done'
		});		
		
	} else {
		res.redirect('/');
	}
});

// user listing
router.get("/listUsers/:page", function(req, res) {	
	waterfall([
			function(callback) {
				var pager = {
					'count' : 0,
					'currPage' : 1,
					'pager_view' : '',
					'pager_url' : '/settings/listUsers/',
					'requested_page' :  req.params.page,
					'limit' :  0
				};
				
				userModel.getUserCount(function executeSql(sqlErr, rows) {
					if (sqlErr) {
						log.logger.error(sqlErr);	
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
						log.logger.error(err);	
						return;
					} else {					
						callback(null, pager_obj, start);
					}
				});												
			},
			function(pager, start, callback) {
				var params = [start, pager.limit];
				userModel.getUserList(params,
						function executeSql(sqlErr, rows) {
							if (sqlErr) {
								log.logger.error(sqlErr);	
								return;
							} else {
								res.statusCode = 201;
								res.render('settings/user_list', {
									title : apptitle,
									data : rows,
									pager : pager,
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

});

// Function to get/extract the emailId from input text
function extractEmails (text){
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

//Common function to redirect user 
function redirectAddUser(req, res, renderView, userInfo, page_message, msg){
	res.render(renderView, {
		data : userInfo,
		title: apptitle,
		message_login:'',
		message : msg,
		page_message: page_message,
		action : '/settings/saveUser',
		session_user : req.session.user
	});
}

module.exports = router;