var https = require('https'),fs = require('fs'),qs = require('qs'),
file,json,apiKey,body,path,targetURL,request,_result,places,idList,
options,loginData,loginOptions,loginRequest,loginID,loginPasswd
;

file = fs.readFileSync("js/config.json");
json = JSON.parse(file.toString());
apiKey = json.apiKey.production;
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
    deleteACSData(idList[i]);
  }
  // console.log(idList);
  // deleteACSData(idList[0]);
});


function placeSearch(callback){
  body='';
  path = '/v1/places/search.json?per_page=100&key=' + apiKey,
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

function deleteACSData(placeID){
  loginRequest = https.request(loginOptions, function(response) {
    response.on('data', function (chunk) {
      body += chunk;
    });
    var postbody,request1,headers,result,cookie;
    // ログイン時のセッション情報を維持するためのクッキーを取得
    headers = response.headers["set-cookie"].toString().split("=");
    result = headers[1].split(";");
    cookie = result[0];
    var body1='',
    deleteRequest;
    var options = {
      hostname: 'api.cloud.appcelerator.com',
      port: 443,
      path: '/v1/places/delete.json?place_id=' + placeID + '&key=' + apiKey,
      method: 'DELETE',
      headers: {
        'Cookie': "_session_id=" + cookie,
        'Content-Length': 0
      }
    };
    response.on('end', function (chunk) {

      deleteRequest = https.request(options, function(res) {
        res.on('data', function (chunk) {
          body1 += chunk;
        });
        res.on('end',function(chunk){
          console.log(body1);
          console.log('done');
        });
      });

      deleteRequest.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      deleteRequest.end();
    });
  });
  loginRequest.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  loginRequest.write(loginData);
  loginRequest.end();

}
