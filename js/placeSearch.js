var https = require('https'),fs = require('fs'),qs = require('qs'),
file,json,apiKey,body,path,targetURL,request,_result,places,idList,
options,loginData,loginOptions,loginRequest,loginID,loginPasswd
;

file = fs.readFileSync("js/config.json");
json = JSON.parse(file.toString());
apiKey = json.apiKey.development;
idList = [];

loginID = json.login;
loginPasswd = json.password;

loginData = qs.stringify({
  login:loginID,
  password:loginPasswd
});

loginOptions = {
  hostname: 'api.cloud.appcelerator.com',
  port: 443,
  path: '/v1/users/login.json?key=' + apiKey,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': loginData.length
  }
};


placeSearch(function(idList){

  for(var i=0;i<idList.length;i++){
    // console.log(idList);
  }

});


function placeSearch(callback){
  body='';
  path = '/v1/places/search.json?per_page=10&key=' + apiKey,
  targetURL = "https://api.cloud.appcelerator.com" + path;
  request = https.request(targetURL, function(response) {
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function (chunk) {
       _result = JSON.parse(body);
      places = _result.response.places;
      for(var i=0;i<places.length;i++){
        console.log(places);
        idList.push(places[i].id);
        console.log("GET SHOP DATA. name is:" + places[i].name);
      }
      callback(idList);
    });

  });

  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });


  request.end();

}

