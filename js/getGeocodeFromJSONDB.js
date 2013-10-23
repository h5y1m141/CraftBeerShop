var http = require('http'),
xml2js   = require('xml2js'),
util     = require('util'),
fs = require('fs'),
cronJob  = require('cron').CronJob,
parser,jsondb,request,options,address,body,cronTime,job,count,file,shopData;
file = fs.readFileSync("js/minoh.json");
jsondb = JSON.parse(file);
shopData = [];
// jsondb = [{
//     "shopname":"BAR MINO",
//     "telephone":"011-272-2004",
//     "address":"渋谷区松濤1-29-1 クロスロードビル2F",
//     "beerName":["みのう","ミノウ","みのお","ミノオ","箕面"]
//   }
// ];

parser = new xml2js.Parser();
count = 0;

var timerId = setInterval(function(){
  address = encodeURI(jsondb[count].address);
  options = {
    hostname: 'www.geocoding.jp',
    port: 80,
    path: '/api/?v=1.1&d=tokyo&q=' + address,
    method: 'GET'

  };

  fetch(options,jsondb[count]);
  count += 1;
  if(count > jsondb.length-1){
    console.log("parse done. number of shop is :" + shopData.length);
    console.log("shopdata :" + shopData);
    // fs.writeFileSync("js/coedoWithGeocode.json", shopData);
    clearInterval(timerId);
  }


},5000);

function fetch(options,jsondb){
  body = "";
  request = http.request(options, function(response) {
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end',function() {
      parser.parseString(body, function (err, result) {
        if(err){
          console.log(err);
        }else{
          // console.log("lat:" +result.result.coordinate_tokyo[0].lat);
          // console.log("lng:" +result.result.coordinate_tokyo[0].lng);
          // console.log(jsondb.shopname);
          console.log(JSON.stringify(
              {
                "name":jsondb.shopname,
                "phone_number":jsondb.telephone,
                "address":jsondb.address,
                "latitude":result.result.coordinate[0].lat[0],
                "longitude:":result.result.coordinate[0].lng[0]
              }
          ) + ",");
          shopData.push(
            JSON.stringify(
              {
                "name":jsondb.shopname,
                "phone_number":jsondb.telephone,
                "address":jsondb.address,
                "latitude":result.result.coordinate[0].lat[0],
                "longitude:":result.result.coordinate[0].lng[0]
              }
            ) + "\n"
          );
          // 変数bodyに次々と取得した値が格納されるから取得後に一旦変数bodyリセットするひつようあり
          body = "";

        }

      });
      parser.on('error',function(){
        console.log("sax can't parse xml");
      });

    });

  });

  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  request.end();
}