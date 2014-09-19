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
		database: "node_test"
    },      
    
    wkhtmltopdf_binPath :  'C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe',
},
production: {
    //url to be used in link generation
    url: 'http://my.site.com',
    //mysql connection settings
    database: {
        host: '127.0.0.1',
        port: '27017',
        db:     'site'
    },
    //server details
    server: {
        host:   '127.0.0.1',
        port:   '3421'
    }
}

};
module.exports = config;