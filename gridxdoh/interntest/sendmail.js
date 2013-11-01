var nodemailer = require("nodemailer");
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
	host : "d23m0016.cn.ibm.com",     // smtp server hostname
	port : "25"                      // smtp server port
});

var url = process.argv[2];

// setup e-mail data with unicode symbols
var mailOptions = {
	from: "gridxadmin@cn.ibm.com", // sender address
	to: "xwzhu@cn.ibm.com", // list of receivers
	subject: "Gridx automatic test is finished", // Subject line
	generateTextFromHTML: true,
	html: [
		'<a href="', url, '">', url, '</a>'
	].join('')
};

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
	if(error){
		console.log(error);
	}else{
		console.log("Message sent: " + response.message);
	}

	// if you don't want to use this transport object anymore, uncomment following line
	smtpTransport.close(); // shut down the connection pool, no more messages
});

