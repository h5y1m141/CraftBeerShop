var fs = require('fs'),
_ = require("../lib/underscore-1.4.3.min"),
coedoFile = fs.readFileSync("js/coedoWithGeocode.json"),
minohFile = fs.readFileSync("js/minohWithGeocode.json"),
mergeData = fs.readFileSync("js/20130807-merge.json"),
craftbeerTokyo = fs.readFileSync("js/craftbeerTokyo.json"),
otherInfo = fs.readFileSync("js/otherInfo.json"),
coedoDB = JSON.parse(coedoFile),
minohDB = JSON.parse(minohFile),
mergeDB = JSON.parse(mergeData),
otherInfoDB = JSON.parse(otherInfo),
craftbeerTokyoDB = JSON.parse(craftbeerTokyo),

// 配列mergeDBと、引数にとる配列を結合する処理
mergeList = mergeDB.concat(otherInfoDB),
result,
item
;


console.log("お店の集計結果：" + mergeList.length);
fs.writeFileSync("js/productionDB.json", JSON.stringify(mergeList));


result = _.groupBy(mergeList,function(data){
  return data.phone_number;
});

// 配列結合した情報をファイルに書き出す


// お店の電話番号にてグルーピングすることで、重複したデータが算出できる

// for(var i in result){
//   var length = result[i].length;
//   if(length == 2){
//     console.log(result[i]);
//   }

// }
