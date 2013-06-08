var https = require('https'),fs = require('fs'),qs = require('qs'),
postdata,options,body,request,loginData,loginOptions,loginRequest,file,apiKey,loginID,loginPasswd,jsondb;
file = fs.readFileSync("js/config.json");
var json = JSON.parse(file.toString());
apiKey = json.apiKey.production;
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

jsondb = JSON.parse(fs.readFileSync("js/minohWithGeocode.json"));


// Test用に１件だけ登録するための処理
  // postdata = qs.stringify({
  //   name      :jsondb[10].name,
  //   state     :jsondb[10].state,
  //   phone_number:jsondb[10].phone_number,
  //   latitude  :jsondb[10].latitude,
  //   longitude :jsondb[10].longitude,
  //   address   :jsondb[10].address
  // });
  // postToACS(postdata);


for(var i=0;i<jsondb.length;i++){
  postdata = qs.stringify({
    name      :jsondb[i].name,
    state     :jsondb[i].state,
    phone_number:jsondb[i].phone_number,
    latitude  :jsondb[i].latitude,
    longitude :jsondb[i].longitude,
    address   :jsondb[i].address
  });
  postToACS(postdata);
}

function postToACS(postdata){
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

}





