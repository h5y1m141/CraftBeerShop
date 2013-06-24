var https = require('https'),fs = require('fs'),qs = require('qs'),
file,json,apiKey,body,path,targetURL,loginRequest,_result,places;

file = fs.readFileSync("js/config.json");
json = JSON.parse(file.toString());
apiKey = json.apiKey.development;

placeSearch();


function placeSearch(){
  body='';
  path = '/v1/places/search.json?per_page=3&key=' + apiKey,
  targetURL = "https://api.cloud.appcelerator.com" + path;
  loginRequest = https.request(targetURL, function(response) {
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function (chunk) {
       _result = JSON.parse(body);
      places = _result.response.places;
      for(var i=0;i<places.length;i++){
        console.log(places[i].id);
      }

    });

  });

  loginRequest.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });


  loginRequest.end();

}
