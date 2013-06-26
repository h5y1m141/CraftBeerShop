var fs = require('fs'),
_ = require("../lib/underscore-1.4.3.min"),
coedoFile = fs.readFileSync("js/coedoWithGeocode.json"),
minohFile = fs.readFileSync("js/minohWithGeocode.json"),
coedoDB = JSON.parse(coedoFile),
minohDB = JSON.parse(minohFile),
mergeList = coedoDB.concat(minohDB),
result,
item
;

// console.log(coedoDB.length);
// console.log(minohDB.length);
console.log(mergeList.length);
result = _.groupBy(mergeList,function(data){
  return data.phone_number;
});

fs.writeFileSync("js/mergeDataWithGeocode.json", JSON.stringify(mergeList));

// お店の電話番号にてグルーピングすることで、重複したデータが算出できる

for(var i in result){
  var length = result[i].length;
  if(length == 2){
    console.log(result[i]);
  }

}
