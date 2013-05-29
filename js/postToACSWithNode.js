var https = require('https'),fs = require('fs'),qs = require('qs'),
postdata,options,body,request,loginData,loginOptions,loginRequest,file,apiKey,loginID,loginPasswd;
file = fs.readFileSync("js/config.json");
var json = JSON.parse(file.toString());
apiKey = json.apiKey;
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

postdata = qs.stringify({
  name:"THE ARCHIGRAM British Pub & Cafe",
  state:"yamagata",
  address:"山形市十日町2-1-35",
  latitude:"38.246297",
  longitude:"140.336086"
});



//Initialise the variable that will store the response
body='';



//Now we're going to set up the request and the callbacks to handle the data
loginRequest = https.request(loginOptions, function(response) {
  //When we receive data, we want to store it in a string
  response.on('data', function (chunk) {
    body += chunk;
  });
  //On end of the request, run what we need to
  var postbody,request1,headers,result,cookie;
  // ログイン時のセッション情報を維持するためのクッキーを取得
  headers = response.headers["set-cookie"].toString().split("=");
  result = headers[1].split(";");
  cookie = result[0];

  options = {
    hostname: 'api.cloud.appcelerator.com',
    port: 443,
    path: '/v1/places/create.json?key=' + apiKey,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "_session_id=" + cookie,
      'Content-Length': postdata.length
    }
  };

  response.on('end',function() {
    request1 = https.request(options, function(res) {
      res.on('data', function (chunk1) {
        postbody += chunk1;
      });
      res.on('end',function() {
        console.log(postbody);
      });
    });
    request1.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    request1.write(postdata);
    request1.end();
  });
});

//Now we need to set up the request itself.
//This is a simple sample error function
loginRequest.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});


//Write our post data to the request
loginRequest.write(loginData);
//End the request.
loginRequest.end();




