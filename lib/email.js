/**
 * New node file
 */
/**
 * New node file
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


exports.transporter = nodemailer.createTransport(smtpTransport({
	    host: 'smtp.office365.com',
	    port: 587,
	    auth: {
            user: "notify@smartek21.com",
            pass: "456@india"
        }
	}));

exports.from_email = 'notify@smartek21.com';
exports.admin_email = 'wiki_pm@mailinator.com';
