var casper,url,list,i,table;
casper = require('casper').create();
url = "http://www.coedobrewery.com/blog/shoplist/";


list = [
  {"prefecture":"北海道","selector": "table#sorter32.sortable tbody tr:nth-child(2)"},
  {"prefecture":"青森","selector": "table#sorter58.sortable tbody tr:nth-child(2)"}
];
casper.start(url,function(){
  console.log(this.getTitle());
});

casper.then(function(){
  console.log("start");
  for(i=0;i<list.length;i++){
    table = this.getHTML(list[i].selector);
    this.echo(table);
  }

});

casper.run();