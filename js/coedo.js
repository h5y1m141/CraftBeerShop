var casper,fs,url,list,i,j,table,count,links,index,result,howMany,__iterator,iter,__next,__hasNext;
casper = require('casper').create({
  clientScripts: ["js/jquery.min.js"]
});
fs = require('fs');

url = "http://www.coedobrewery.com/blog/shoplist/";

casper.start(url,function(){
  console.log(this.getTitle());
});


casper.then(function(){
  links = this.evaluate(function() {
    links = [];
    Array.prototype.forEach.call(__utils__.findAll('td'), function(e) {
      links.push(e.innerText);
    });
    return links;
  });
});



casper.then(function(){
  // JSで複数個ずつ配列から取り出す処理は以下を参考に実装
  // http://rokujyouhitoma.hatenablog.com/entry/2013/01/23/010319
  __iterator = function (collection, howMany) {
    count = 0;
    __next = function() {
      index = howMany * count;
      result = collection.slice(index, index + howMany);
      count += 1;
      return result;
    };
    __hasNext = function() {
      index = howMany * count;
      return collection.slice(index, index + howMany).length > 0;
    };
    return {next: __next, hasNext: __hasNext};
  };

  iter = __iterator(links, 5);
  var _result = [];
  while(iter.hasNext()) {
    var _shop = iter.next();
    var _data = {
      "shopName":_shop[0],
      "telephone":_shop[2],
      "address":_shop[3],
      "shopWebSite":_shop[4],
      "beerName":["COEDO","コエド","こえど"]
    };
    _result.push(JSON.stringify(_data) + "\n");

  }
  fs.write("js/coedo.json", _result, 'w');
  console.log(links.length);
});
casper.run();
