var http = require('http');
//var date = require('./public/lib/date.format');
var dUtils = require('date-utils');

var url  = '/2/events?per_page=100&';
//'datetime_utc=2012-12-12&per_page=100&page=';

var sDate = new Date("12-12-2012");
sDate.addDays(1);
var formatDate = sDate.toFormat("YYYY-MM-DD");
console.log(formatDate);

var createCountdown = function(event) {
    //console.log(event);
    var vanityUrl = event.short_title.replace(/[^\sa-z0-9]/gi, '').toLowerCase();
    vanityUrl = vanityUrl.replace(/\s+/gi, '-');

    var tDate = new Date(event.datetime_utc);
    var targetDate = tDate.toFormat('MMM DD, YYYY HH:MI:SS PP');

    var body = {
        id:1,
        jsonrpc:"2.0",
        method:"countdown.create",
        params: {
            args: {
                targetDate: targetDate,
                format: 'Days',
                eventName: event.short_title + ' @ ' + event.venue.name + ' in ' + event.venue.city + ', ' + event.venue.state,
                vanityUrl: vanityUrl,
                externalId:event.id,
                externalSource:'api.seatgeek.com'
            }
        }
    };
    //console.log(body);
    var bodyStr = JSON.stringify(body);

    var options = {
        host: 'secondstill',
        port: 80,
        path: '/',
        method: 'POST',
        headers: {"Content-Type":'application/json',"Content-Length":bodyStr.length}
    };


    var req = http.request(options,function(res) {
        res.setEncoding('utf8');
        var str = '';
        res.on('data', function(d) { str = str+d; });
        res.on('end', function() {
            //console.log(str);

            //var res = JSON.parse(str);
            //console.log('response from secondstill:');
            //console.log(res.result.success);
        });
    });

    req.write(bodyStr);
    req.end();
};

var fetchEvents = function(date,page) {
    var newUrl = url + 'datetime_utc='+date+'&page='+page;
    console.log('getting events with url:'+newUrl);

    var options = {
        'host':'api.seatgeek.com',
        'port':80,
        'path':newUrl
    };

    http.get(options,function (res) {
        res.setEncoding('utf8');
        var str = '';
        res.on('data', function(d) { str = str+d; });
        res.on('end', function() {
            var res = JSON.parse(str);
            //console.log(res);
            res.events.forEach(function(val,idx) {
                createCountdown(val);
            });

            if ((res.meta.per_page * page) <= res.meta.total) {
                var nextPage = page + 1;
                fetchEvents(date,nextPage);
            } else {
                sDate.addDays(1);
                var formatDate = sDate.toFormat("YYYY-MM-DD");
                console.log('next date:');
                console.log(formatDate);
                fetchEvents(formatDate,1);
            }
        });
    });


};

fetchEvents(formatDate,1);
