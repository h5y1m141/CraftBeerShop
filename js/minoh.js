var casper,fs,url,list,i,j,table,count,shopnameList,index,_result,addressList,phoneList,geocodeURL;
casper = require('casper').create({
  clientScripts: ["js/jquery.min.js"]
});
fs = require('fs');

url = "http://www.minoh-beer.jp/spot/spotlist/";

casper.start(url,function(){
  console.log(this.getTitle());
});


casper.then(function(){
  shopnameList = this.evaluate(function() {
    shopnameList = [];
    Array.prototype.forEach.call(__utils__.findAll('td.shopname'), function(e) {
      shopnameList.push(e.innerText);
    });
    return shopnameList;
  });
});

casper.then(function(){
  addressList = this.evaluate(function() {
    addressList = [];
    Array.prototype.forEach.call(__utils__.findAll('td.address'), function(e) {
      addressList.push(e.innerText);
    });
    return addressList;
  });
});

casper.then(function(){
  phoneList = this.evaluate(function() {
    phoneList = [];
    Array.prototype.forEach.call(__utils__.findAll('td.phone'), function(e) {
      phoneList.push(e.innerText);
    });
    return phoneList;
  });
});


casper.then(function(){
  _result = [];
  for(var i=0;i<shopnameList.length;i++){
    var _data = {
      "shopname":shopnameList[i],
      "telephone":phoneList[i],
      "address":addressList[i],
      "beerName":["みのう","ミノウ","みのお","ミノオ","箕面"]
    };
    _result.push(JSON.stringify(_data) + "\n");
  }
  fs.write("js/minoh.json", _result, 'w');

});
var data,wsurl ='http://api.site.com/search.json';
casper.then(function(){
  data = this.evaluate(function(wsurl) {
        return JSON.parse(__utils__.sendAJAX(wsurl, 'GET', null, false));
    }, {wsurl: wsurl});

});
casper.then(function() {
    require('utils').dump(data);
});
casper.run();
