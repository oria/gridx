var nodemailer = require("nodemailer");
var url = process.argv[2];
var content = [
	'<a href="', url, '">', url, '</a>'
].join('');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
	host : "d23m0016.cn.ibm.com",     // smtp server hostname
	port : "25"                      // smtp server port
});

function onSent(error, response){
	if(error){
		console.log(error);
	}else{
		console.log("Message sent: " + response.message);
	}
	smtpTransport.close();
}

smtpTransport.sendMail({
	from: "gridxadmin@cn.ibm.com", // sender address
	to: "xwzhu@cn.ibm.com", // list of receivers
	subject: "Gridx automatic test is finished", // Subject line
	generateTextFromHTML: true,
	html: content
});

smtpTransport.sendMail({
	from: "gridxadmin@cn.ibm.com", // sender address
	to: "zhuxw1984@gmail.com", // list of receivers
	subject: "Gridx automatic test is finished", // Subject line
	generateTextFromHTML: true,
	html: content
});
