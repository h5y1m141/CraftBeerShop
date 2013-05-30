var http = require('http'),xml2js = require('xml2js'),util = require('util'),
parser,jsondb,request,options,address,body;

jsondb = [{
    "shopname":"BAR MINO",
    "telephone":"011-272-2004",
    "address":"札幌市中央区北1西3 古久根ビル　B1F",
    "beerName":["みのう","ミノウ","みのお","ミノオ","箕面"]
  }, {
    "shopname":"beer&food HIGURASHI",
    "telephone":"011-532-8480",
    "address":"札幌市中央区南5条西2丁目社交会館3F",
    "beerName":["みのう","ミノウ","みのお","ミノオ","箕面"]
  }
];


address = encodeURI(jsondb[1].address);
options = {
  hostname: 'www.geocoding.jp',
  port: 80,
  path: '/api/?v=1.1&d=tokyo&q=' + address,
  method: 'GET'

};
parser = new xml2js.Parser();

// var xml = '<?xml version="1.0" encoding="UTF-8" ?><result><version>1.1</version><address>札幌市中央区南5条西2丁目社交会館3F</address><coordinate><lat>43.054937</lat><lng>141.356103</lng><lat_dms>43,3,17.773</lat_dms><lng_dms>141,21,21.971</lng_dms></coordinate><coordinate_tokyo><lat>43.052517</lat><lng>141.359829</lng><lat_dms>43,3,9.06</lat_dms><lng_dms>141,21,35.385</lng_dms></coordinate_tokyo><url>http://www.geocoding.jp/?q=%E6%9C%AD%E5%B9%8C%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8D%975%E6%9D%A1%E8%A5%BF2%E4%B8%81%E7%9B%AE%E7%A4%BE%E4%BA%A4%E4%BC%9A%E9%A4%A83F&amp;d=tokyo</url><needs_to_verify>yes</needs_to_verify><google_maps>北海道札幌市中央区南５条西２丁目 社交会館</google_maps></result>';

//     parser.parseString(xml, function (err, result) {
//       console.log(result);

//     });


body="";
request = http.request(options, function(response) {
  response.on('data', function (chunk) {
    body += chunk;
  });

  response.on('end',function() {

    parser.parseString(body, function (err, result) {
      console.log("lat:" +result.result.coordinate_tokyo[0].lat);
      console.log("lng:" +result.result.coordinate_tokyo[0].lng);

    });
  });

});

request.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

request.end();
