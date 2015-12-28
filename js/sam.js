
var fs1 = require('fs');
var LineByLineReader = require('line-by-line'),
    //lr = new LineByLineReader('WDI_Data.csv');
    lr = new LineByLineReader('./../data/WDI_Data.csv');
    //var lines =[];
    var heading = [];
    var words=[];
    var count=0;
    var flag=0;
    var cont_coun ={};                                                         //for stroring the data
    var array_country=[];                                                       //for storing the country
    //var store_data="[";
    var obj1 ={};
    var json=[];

    var obj = {
      Africa:{},
      Asia:{},
      "North America":{},
      "South America":{},
      Europe:{},
      Oceania:{}
    };

    // fs1.appendFile("./test.txt",store_data, function(err) {
    //   if(err) {
    //       return console.log(err);
    //   }
    //
    //   //console.log("The file was saved!:"+count++);
    // });

lr.on('error', function (err) {
	// 'err' contains error object
  console.log(err);
});

lr.on('line', function (line) {
	// 'line' contains the current line without the trailing newline character.
  //console.log(line[0]);
  if(flag==0)
  {
    heading = line.split(',');                                                  //spliting the heading part
    flag=1;
    /*for(var j=0;j<heading.length;j++)
    {
      console.log(heading[j]);
    }*/

    fs1.readFile('./../data/Countries-Continents.csv', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      //console.log(data);
      var split_cont = data.split('\n');
      //console.log(split_cont.length);
      for(var c=1;c<split_cont.length;c++)
      {
        //obj1={};
        var each_word=split_cont[c].split(',');
        //console.log(each_word.length);
        //for(var h=0;h<each_word.length;h++)
        //{
          //console.log(each_word[1]+" "+each_word[0]);
          obj1[each_word[1]]=each_word[0];
        //}
        //console.log(obj1[each_word[1]]);
        //array_country.push(obj1);
        //console.log(array_country);
      }
      console.log(obj1);

    });
  }
  else
  {

        var words = line.split(',');

        var k=0;
        //var flag=1;
        var temp_str="";
        for(var j=0;j<words.length;j++)                                              //traversing  the completeing the word
        {
          //console.log(words[j]);
          if(words[j].charAt(0)=='"')                                                 //if any word's first letter is "
          {
            //console.log("yuppie i found one");
            k=0;
            temp_str=words[j]
            do
            {
              k++;
              temp_str=temp_str.concat(","+words[j+k]);
            } while(words[j+k].charAt(words[j+k].length-1)!='"')
            //console.log(temp_str);
            words[j]=temp_str;
            words[j] = words[j].replace('"','');
            words[j] = words[j].replace('"','');
            for(var m=j+1;m<words.length-k;m++)
            {
              words[m]=words[m+k];
            }

            for(var m=0;m<k;m++)
            {
              words.pop();
            }

          }
        }

        //console.log(words.length);
        //store_data="{";

        //var flag1=0;



          //  console.log(words[0]+":"+obj1[words[0]]);




      if((words[2]=="GDP per capita (constant 2005 US$)") && (obj[obj1[words[0]]] !== undefined))
      {
        //console.log("We are inside the operation");
        for(var i=4;i<words.length;i++)
        {
          //console.log(heading[i]+" : "+words[i]);

          //if(words[0]=="Africa")
          //{
            //console.log();
            //console.log(obj[obj1[words[0]]][heading[i]]);


              //console.log(obj[obj1[words[0]]]);
              if(words[i]=="")
                {
                  obj[obj1[words[0]]][heading[i]]= isNaN(parseInt(obj[obj1[words[0]]][heading[i]]))?0:(parseInt(obj[obj1[words[0]]][heading[i]]));
                  //console.log(obj[obj1[words[0]]][heading[i]]);
                }
              else
                {
                  obj[obj1[words[0]]][heading[i]]= isNaN(parseInt(obj[obj1[words[0]]][heading[i]]))?0:(parseInt(obj[obj1[words[0]]][heading[i]]))+parseInt(words[i]);
                  //console.log(obj[obj1[words[0]]][heading[i]]);
                }
          //}


        }
        //console.log(obj);
      //  json.push(obj);
      }

  }
});

lr.on('end', function () {

  console.log(obj);
  //json.push(obj);
 //  function compare(a,b) {
 //  if (a["2005"] < b["2005"])
 //    return -1;
 //  if (a["2005"] > b["2005"])
 //    return 1;
 //  return 0;
 //  }
 //
 //  json.sort(compare);
 // json = json.slice(json.length-16, json.length-1);
  fs1.appendFile("./../data/test.json", JSON.stringify(obj) , function(err) {
    if(err) {
        return console.log(err);
    }
  });

});
