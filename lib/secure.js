var util = require('../lib/utils');

module.exports = function(req,res,next) {

    return next();


    //default to https unless its one of the whitelisted urls
    console.log('fetched '+req.url);
    var whitelist = ['/','/index'];
    //if this url is not secure
    if (!app.settings.secure) {
	//and it is not in the insecure url whitelist
	if (!util.inArray(req.url,whitelist)) {
	    //then redirect to secure
	    var r = 'https://secondstill.com'+req.url;
	    console.log(req.url+' can not be insecure, redirecting to: '+r);
	    return res.redirect(r);
	}
    }
    next();
}
