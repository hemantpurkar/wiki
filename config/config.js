var ActiveDirectory = require('activedirectory');
var config = {
environment : 'development',		
development: {
    //url to be used in link generation
    url: 'http://localhost:3000',      
    
    //mysql connection settings
    database: {
        host : "localhost",
		user : "root",
		password: "",
		database: "wiki"
    },      
    
    wkhtmltopdf_binPath :  'C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe',
},
production: {
    //url to be used in link generation
    url: 'http://192.168.50.120:3000',      
    
    //mysql connection settings
    database: {
        host : "localhost",
		user : "root",
		password: "root",
		database: "wiki"
    },
},

//Active directory ... Pune location configuration variable
adPune : new ActiveDirectory({ url: 'ldap://pune.smartek21.st21/',
    baseDN: 'dc=pune,dc=smartek21,dc=st21',
    username: 'hemantp@pune.smartek21.st21',
    password:'smartek123$'
}),
  
//Active directory ... Chennai location configuration variable
adChennai : new ActiveDirectory({ url: 'ldap://192.168.8.50/',
    baseDN: 'dc=chennai,dc=smartek21,dc=st21',
    username: 'adread@chennai.smartek21.st21',
    password:'Xr"I35DK~P'
}),

// 512 : Active Directory normal account enabled
NORMAL_ACCOUNT : 512, 

//10000 : Value added to wiki_type_id (Used in settings controller)
RAND_VAL : 10000,
}  

module.exports = config;
