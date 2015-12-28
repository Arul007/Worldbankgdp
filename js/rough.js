//importing fs moulde
var fs = require('fs');
var arrGdpGni=[];
var arrGdpPerGniPer=[];
var country;
var gdp;
var gni;
var gdpPer;
var gniPer;
//data structure for India gdp plotting
function gdpIND (year, gdp) {
  this.year=year;
  this.gdp=gdp;
};

function gdpGni (country, gdp, gni) {
  this.country=country;
  this.gdp=gdp;
  this.gni=gni;
};

function gdpPerGniPer (country, gdpPer, gniPer) {
  this.country=country;
  this.gdpPer=gdpPer;
  this.gniPer=gniPer;
};

var buffer = '';
var rs = fs.createReadStream('../data/WDI_Data.csv');
rs.on('data', function(chunk) {
  var lines = (buffer + chunk).split('\n');
  buffer = lines.pop();
  for (var i = 0; i < lines.length; ++i) {
    processTheFile(lines[i]);
  }
});
rs.on('end', function() {
  if(buffer)
  {
    processTheFile(buffer);
  }
  createJson(arrGdpGni,arrGdpPerGniPer);
});

rs.on('error',function(){
  console.log("error reading the file");
});

function processTheFile(line){
  var row=line.split(',');

  if(row[2]=="GDP at market prices (constant 2005 US$)" && notTheRegions(row[0]))
  {
      country=row[0];
      gdp=Number(row[49]);
      gdp=parseInt(gdp);
      gni=null;
  }
  if(row[2]=="GNI (constant 2005 US$)" && country)
  {
        gni=parseInt(Number(row[49]));
          if(gdp && gni)
          {
    if(arrGdpGni.length<15)
    {
    arrGdpGni.push(new gdpGni(country, gdp, gni));
    if(arrGdpGni.length==15)
    {
    arrGdpGni.sort(function(a,b){
      if(a.gdp<b.gdp){
        return 1;
      }
      else{
      return -1;
    }
    });
    }
    }
    else {

      if(arrGdpGni[arrGdpGni.length-1].gdp<gdp)
      {
      arrGdpGni[arrGdpGni.length-1]=new gdpGni(country, gdp, gni);
        arrGdpGni.sort(function(a,b){
          if(a.gdp<b.gdp){
            return 1;
          }
          else{
          return -1;
        }
      });
    }
    }
    gdp=null;
    gni=null;
  }
}

if(row[2]=="GDP per capita (constant 2005 US$)")
  {
gdpPer=parseInt(Number(row[49]));
gniPer=null;
  }
  if(row[2]=="GNI per capita (constant 2005 US$)")
  {
gniPer=parseInt(Number(row[49]));
if(gdpPer && gniPer)
{
  if(arrGdpPerGniPer.length<15)
  {
  arrGdpPerGniPer.push(new gdpPerGniPer(country, gdpPer, gniPer));
  if(arrGdpPerGniPer.length==15)
  {
  arrGdpPerGniPer.sort(function(a,b){
  if(a.gdpPer<b.gdpPer){
    return 1;
  }
  else{
  return -1;
  }
  });
  }
  }
  else {

  if(arrGdpPerGniPer[arrGdpPerGniPer.length-1].gdpPer<gdpPer)
  {
  arrGdpPerGniPer[arrGdpPerGniPer.length-1]=new gdpGni(country, gdpPer, gniPer);
    arrGdpPerGniPer.sort(function(a,b){
      if(a.gdpPer<b.gdpPer){
        return 1;
      }
      else{
      return -1;
    }
  });
  }
  }
  gdpPer=null;
  gniPer=null;
  country=null;
}
  }


var flag=true;
  if(flag && row[0]==="India" && row[2]=="GDP growth (annual %)")
  {
    flag=false;
    var gdpIndArr = [];
    for(var i=4,year=1960;i<60;i++,year++)
    {
      if(row[i])
      {
        gdpIndArr.push(new gdpIND(year,parseFloat(row[i])));
      }
    }
    var gdpINDJson = JSON.stringify(gdpIndArr, null, 4);
    fs.writeFile( "../data/gdpIND.json", gdpINDJson, function(err) {
      if(err) {
        return console.log(err+" :error writing to JSON file");
      }
    });
  }
}

function createJson(arrGdpGni,arrGdpPerGniPer) {
  var gdpGniJson = JSON.stringify(arrGdpGni, null, 4);
  fs.writeFile( "../data/gdpGni.json", gdpGniJson, function(err) {
    if(err) {
      return console.log(err+" :error writing to JSON file");
    }
  });

  var gdpPerGniPerJson = JSON.stringify(arrGdpPerGniPer, null, 4);
  fs.writeFile( "../data/gdpPerGniPer.json", gdpPerGniPerJson, function(err) {
    if(err) {
      return console.log(err+" :error writing to JSON file");
    }
  });
}

function notTheRegions(country){
return country!="World" &&country!= "High income" && country!= "OECD members" &&
country!="High income: OECD"&&country!= "Europe & Central Asia (all income levels)" &&
country!="European Union" &&country!="North America"&&country!= "Euro area" &&
country!="East Asia & Pacific (all income levels)"&&country!= "Low & middle income"&&
country!= "Middle income" &&country!="Upper middle income"&&country!="Latin America & Caribbean (all income levels)"&&
country!="High income: nonOECD" && country!="East Asia & Pacific (developing only)"&&
country!="Latin America & Caribbean (developing only)"&&country!="Lower middle income"&&country!="South Asia"&&
country!="Europe & Central Asia (developing only)"&&country!="Middle East & North Africa (all income levels)"&&
country!="Arab World"&&country!="Central Europe and the Baltics"&&country!="Middle East & North Africa (developing only)"&&
country!="Sub-Saharan Africa (all income levels)";

}
