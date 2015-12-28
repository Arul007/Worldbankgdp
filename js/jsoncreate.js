var fs = require('fs');
var arrGdpGni=[];
var arrGdpPerCapitaGniPerCapita=[];
var arrGdpIndia = [];
var arrContinent=[];
var continent;
var country;
var gdp;
var gni;
var gdpPerCapita;
var gniPerCapita;

function gdpIndia (year, gdp) {
  this.year=year;
  this.gdp=gdp;
};

function gdpGni (country, gdp, gni) {
  this.country=country;
  this.gdp=gdp;
  this.gni=gni;
};

function gdpPerCapitaGniPerCapita (country, gdpPerCapita, gniPerCapita) {
  this.country=country;
  this.gdpPerCapita=gdpPerCapita;
  this.gniPerCapita=gniPerCapita;
};

function gdpPerContinent (continent,gdpPerCapitaAggregate, year) {
  this.continent=continent;
  this.gdpPerCapitaAggregate=gdpPerCapitaAggregate;
  this.year=year;
};


var data = '';
var csvData = fs.createReadStream('./../data/WDI_Data.csv');
csvData.on('data', function(raw) {
  var lines = (data + raw).split('\n');
  data = lines.pop();
  for (var i = 0; i < lines.length; ++i) {
    csvJSON(lines[i]);
  }
});
csvData.on('end', function() {
  if(data)
  {
    csvJSON(data);
  }
  createJson(arrGdpGni);
  createJson(arrGdpPerCapitaGniPerCapita);
  createJson(arrGdpIndia);
});

csvData.on('Error',function(){
  console.log("Error in Reading the File");
});

function csvJSON(line){
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
gdpPerCapita=parseInt(Number(row[49]));
gniPerCapita=null;
  }
  if(row[2]=="GNI per capita (constant 2005 US$)")
  {
gniPerCapita=parseInt(Number(row[49]));
if(gdpPerCapita && gniPerCapita)
{
  if(arrGdpPerCapitaGniPerCapita.length<15)
  {
  arrGdpPerCapitaGniPerCapita.push(new gdpPerCapitaGniPerCapita(country, gdpPerCapita, gniPerCapita));
  if(arrGdpPerCapitaGniPerCapita.length==15)
  {
  arrGdpPerCapitaGniPerCapita.sort(function(a,b){
  if(a.gdpPerCapita<b.gdpPerCapita){
    return 1;
  }
  else{
  return -1;
  }
  });
  }
  }
  else {

  if(arrGdpPerCapitaGniPerCapita[arrGdpPerCapitaGniPerCapita.length-1].gdpPerCapita<gdpPerCapita)
  {
  arrGdpPerCapitaGniPerCapita[arrGdpPerCapitaGniPerCapita.length-1]=new gdpPerCapitaGniPerCapita(country, gdpPerCapita, gniPerCapita);
    arrGdpPerCapitaGniPerCapita.sort(function(a,b){
      if(a.gdpPerCapita<b.gdpPerCapita){
        return 1;
      }
      else{
      return -1;
    }
  });
  }
  }
  gdpPerCapita=null;
  gniPerCapita=null;
}
  }


var flag=true;
  if(flag && row[0]==="India" && row[2]=="GDP growth (annual %)")
  {
    flag=false;

    for(var i=4,year=1960;i<60;i++,year++)
    {
      if(row[i])
      {
        arrGdpIndia.push(new gdpIndia(year,parseFloat(row[i])));
      }
    }
  }

}

function createJson(arrGdpGni) {
  var gdpGniJson = JSON.stringify(arrGdpGni, null, 4);
  fs.writeFile( "../data/gdpGni.json", gdpGniJson, function(err) {
    if(err) {
      return console.log(err+" :Error writing to JSON file");
    }
  });
}

function createJson(arrGdpPerCapitaGniPerCapita){
  var gdpPerCapitaGniPerCapitaJson = JSON.stringify(arrGdpPerCapitaGniPerCapita, null, 4);
  fs.writeFile( "../data/gdpPerCapitaGniPerCapita.json", gdpPerCapitaGniPerCapitaJson, function(err) {
    if(err) {
      return console.log(err+" :Error writing to JSON file");
    }
  });
}

function createJson(arrGdpIndia){
var gdpIndiaJson = JSON.stringify(arrGdpIndia, null, 4);
fs.writeFile( "./../data/gdpIndia.json", gdpIndiaJson, function(err) {
  if(err) {
    return console.log(err+" :Error writing to JSON file");
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
