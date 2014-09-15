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
var apptitle = 'Wiki';

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
				//logAndRespond(sqlErr, res);
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
		eventModel.deleteEventType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				//logAndRespond(sqlErr, res);
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
				//logAndRespond(sqlErr, res);
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
				//logAndRespond(sqlErr, res);
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
				//logAndRespond(sqlErr, res);
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
		res.render('settings/wiki_type_post', {
            title: apptitle,
            message: '',
            page_message: 'Create',
            data:'',
            wikitype:'',
            action:'/settings/saveWikiType',
            session_user : req.session.user
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
	     
		var params = [title];
		wikiModel.createWikiType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				//logAndRespond(sqlErr, res);
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
		wikiModel.getWikiType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				//logAndRespond(sqlErr, res);
				log.logger.error(sqlErr);	
				return;
			} else {
				res.statusCode = 201;
				res.render('settings/wiki_type_post', {
					data : rows[0],
					message : '',
					title : apptitle,
					wikiattchment : '',
					page_message : 'Edit',
					action : '/settings/update_wikiType',	
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
router.post('/update_wikiType', function(req, res) {
	if (req.session.loggedIn) {
		var data = req.body;
	    var title  = data.title || '';
	    var type_id  = data.wiki_type_id || '';
	     
		var params = [title, type_id];
		wikiModel.updateWikiType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				//logAndRespond(sqlErr, res);
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
		wikiModel.deleteWikiType(params, function executeSql(sqlErr, rows) {
			if (sqlErr) {
				//logAndRespond(sqlErr, res);
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
						//logAndRespond(sqlErr, res);
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
						//logAndRespond(err, res);
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
								//logAndRespond(sqlErr, res);
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
						//logAndRespond(sqlErr, res);
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
						//logAndRespond(err, res);
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
								//logAndRespond(sqlErr, res);
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
		/*waterfall([
		    function(callback){       
		    	userModel.getAllUsers(function executeSql(sqlErr1, rows1) {
					if (sqlErr1) {
						logAndRespond(sqlErr1, res);
						return;
					} else {	
						callback(null, rows1);						
					}
				});
		    },	
		    function(rows1, callback){		    	
		    	groupUsersModel.getAllGroupUsers(function executeSql(sqlErr2, rows2) {
					if (sqlErr2) {
						logAndRespond(sqlErr2, res);
						return;
					} else {	
						res.statusCode = 201;
						res.render('settings/group_create', {
							data : '',
							groupId : '',
							message : '',
							title : apptitle,			
							page_message : 'Create',
							action : '/settings/saveGroup',		
							users : rows1,
							group_users : rows2,
							session_user : req.session.user
						});
						return;
					}								
				});										
				callback(null, 'done');
		    }
		 ], function(err, result) {
			// result now equals 'done'
		});	*/
		userModel.getAllUsers(function executeSql(sqlErr1, rows1) {
			if (sqlErr1) {
				//logAndRespond(sqlErr1, res);
				log.logger.error(sqlErr1);	
				return;
			} else {	
				res.render('settings/group_create', {
					data : '',
					groupId : '',
					message : '',
					title : apptitle,			
					page_message : 'Create',
					action : '/settings/saveGroup',		
					users : rows1,
					group_users : '',
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
router.post('/saveGroup', function(req, res) {
	if (req.session.loggedIn) {
		var data = req.body;
	    var group_name  = data.group_name || '';
	    var currDate = new Date();
	    var group_users = data.group_users || '';
	    var group_lead = data.group_lead || '';
	    var user_group_id = data.user_group_id || '';
	    var group_email = data.group_email || '';
	    
	    waterfall([
	   			function(callback) {	
	   				var rows1;
	   				if(user_group_id == ''){
		   				//Add group
	   			    	 var params = [group_name, group_email, req.session.user.id, currDate, currDate];				    	 
	   			    	 groupModel.addGroup(params, function executeSql(sqlErr1,rows1) {	
	   			    		if (sqlErr1) {
	   								//logAndRespond(sqlErr1, res);
	   			    				log.logger.error(sqlErr1);	
	   								return;
	   						} else {
	   								user_group_id = rows1.insertId;
	   								callback(null, user_group_id);
	   						}
	   					}); 
	   				}
		   			else{
		   				//Update group
	   			    	 var params = [group_name, group_email, currDate, user_group_id];				    	 
	   			    	 groupModel.updateGroup(params, function executeSql(sqlErr1,rows1) {	
	   			    		if (sqlErr1) {
	   								//logAndRespond(sqlErr1, res);
	   			    				log.logger.error(sqlErr1);	
	   								return;
	   						} else {
	   								callback(null, user_group_id);
	   						}
	   					});		   				
		   			}
	   			},	
	   			function(user_group_id, callback) {	   	
	   				//Delete existing users for group users		
	   				var params = [user_group_id];
	   				groupUsersModel.deleteGroupUsers(params, function executeSql(sqlErr2,rows2) {					
	   					if (sqlErr2) {
	   						//logAndRespond(sqlErr2, res);
	   						log.logger.error(sqlErr2);	
	   						return;
	   					} 
	   					else{
	   						callback(null, user_group_id, rows2);
	   					}
	   				 });						
	   			},
	   			function(user_group_id, rows2, callback) {
	   				//Add group users
	   				var rows3;
	   				var params = [];
	   				var cnt =0;
	   				var user_is_lead = false;
				    if(group_users.length > 0){
				    	for(i=0; i < group_users.length; i++){
				    	 params.length = 0;
				    	 if(group_lead == group_users[i]){
				    		 user_is_lead = true;
				    	 }
				    	 params.push(group_users[i], user_group_id);
				    	 groupUsersModel.addGroupUsers(params, function executeSql(sqlErr3,rows3) {
		   					if (sqlErr3) {
		   						//logAndRespond(sqlErr3, res);
		   						log.logger.error(sqlErr3);	
		   						return;
		   					} else {
		   						cnt++;
		   						if(cnt == group_users.length){
		   							callback(null, user_group_id, rows2, user_is_lead);	
		   						}
		   					}
				    	 });
				    	} 
				    }	 
				    else{
				    	callback(null, user_group_id, rows2, user_is_lead);	
				    }
	   			},
	   			function(user_group_id, rows2, user_is_lead, callback) {
	   				//Assign group lead
	   			     var params = [group_lead, user_group_id];
	   			     if(!user_is_lead){
	   			    	// Is slected users and lead user not same..Insert lead as suser  
	   			    	groupUsersModel.addGroupUsers(params, function executeSql(sqlErr4,rows4) {
		   					if (sqlErr4) {
		   						//logAndRespond(sqlErr4, res);
		   						log.logger.error(sqlErr4);	
		   						return;
		   					} else {
		   						// Update user as lead
		   						groupUsersModel.setGroupLead(params, function executeSql(sqlErr5,rows5) {					
		   	   						if (sqlErr5) {
		   	   							//logAndRespond(sqlErr5, res);
		   	   							log.logger.error(sqlErr5);	
		   	   							return;
		   	   						} 
		   	   						else{
		   	   							res.redirect('/settings/listGroups/0');		   	   							
		   	   						}
		   	   				     });
		   					}
				    	 });
	   			     }
	   			     else{
	   			    	// Update selected user as lead
	   			    	groupUsersModel.setGroupLead(params, function executeSql(sqlErr4,rows4) {					
	   						if (sqlErr4) {
	   							//logAndRespond(sqlErr4, res);
	   							log.logger.error(sqlErr4);	
	   							return;
	   						} 
	   						else{
	   							res.redirect('/settings/listGroups/0');
	   						}
	   				     });
	   			     }		   			    
	   			     callback(null, 'done');
	   			} ], function(err, result) {
	   		// result now equals 'done'
	   		});	    				
	} else {
		res.redirect('/');
	}
});

//Create User Group
router.get('/:group_id/deleteUserGroup', function(req, res) {
	if (req.session.loggedIn) {   	
		var params = [req.params.group_id];
		groupModel.deleteGroup(params, function executeSql(sqlErr1, rows1) {
			if (sqlErr1) {
				//logAndRespond(sqlErr1, res);
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
						//logAndRespond(sqlErr, res);
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
						//logAndRespond(err, res);
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
								//logAndRespond(sqlErr, res);
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

router.get('/:group_id/editUserGroup', function(req, res) {
	if (req.session.loggedIn) {   
		var groupId = req.params.group_id;
		
		waterfall([
			function(callback){  
				var params = [groupId];
				groupModel.getGroupInfo(params, function executeSql(sqlErr1, groupName) {
					if (sqlErr1) {
						//logAndRespond(sqlErr1, res);
						log.logger.error(sqlErr1);	
						return;
					} else {	
						callback(null, groupName);						
					}
				});
			},	       
		    function(groupName, callback){       
		    	userModel.getAllUsers(function executeSql(sqlErr2, allUsers) {
					if (sqlErr2) {
						//logAndRespond(sqlErr2, res);
						log.logger.error(sqlErr2);	
						return;
					} else {	
						callback(null, groupName, allUsers);						
					}
				});
		    },	
		    function(groupName, allUsers, callback){  
		    	var params = [groupId];
		    	groupUsersModel.getGroupUsers(params, function executeSql(sqlErr3, groupUsers) {
					if (sqlErr3) {
						//logAndRespond(sqlErr3, res);
						log.logger.error(sqlErr3);	
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
							users : allUsers,
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
						//logAndRespond(sqlErr, res);
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
						//logAndRespond(err, res);
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
								//logAndRespond(sqlErr, res);
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

/*var logAndRespond = function logAndRespond(err, res, status) {
	console.error(err);
	res.statusCode = ('undefined' === typeof status ? 500 : status);
	res.send({
		result : 'error',
		err : err.code
	});
};*/

module.exports = router;