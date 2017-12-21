
var Driver = require("node-vantage");
var http = require("http");
const querystring = require('querystring');
var vantage = new Driver();

vantage.on("connect", function(error) {
	if (!error) {
                console.log("Connected to the Vantage");
                vantage.on("loop", function(loop) {
                        vantagePost(loop);
                });
	} else {
                vantageError();
        }
});

var vantagePost = function (loopData) {
        const postData = querystring.stringify({
                'readDate': loopData.datetime,
                'barometer': loopData.barometer,
                'inTemperature': loopData.inTemperature,
                'inHumidity': loopData.inHumidity,
                'outTemperature': loopData.outTemperature,
                'windSpeed': loopData.windSpeed,
                'windDirection': loopData.windDirection,
                'outHumidity': loopData.outHumidity,
                'dayRain': loopData.dayRain,
                'rainRate': loopData.rainRate,
                'forecast': loopData.forecast
        });

        const options = {
                hostname: 'vantage-api.herokuapp.com',
                port: 80,
                path: '/read',
                method: 'POST',
                headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(postData)
                }
        };

        const req = http.request(options, (res) => {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                
                res.on('data', (chunk) => {
                        console.log(`BODY: ${chunk}`);
                });
                res.on('end', () => {
                        console.log('No more data in response.');
                });
        });

        req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
        });

        // write data to request body
        req.write(postData);
        req.end();

        setTimeout((function() {  
                return process.exit();
        }), 1000);
};

var vantageError = function () {
        console.log("Failed connecting to the Vantage: " + error);
        
        setTimeout((function() {  
                return process.exit();
        }), 1000);
};





