var fs1 = require('fs');
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('./../data/WDI_Data.csv');
    var heading = [];
    var words=[];
    var count=0;
    var flag=0;
    var cont_coun ={};    //for stroring the data
    var array_country=[]; //for storing the country
    var obj1 ={};
    var json=[];

    var continent = {
      Africa:{},
      Asia:{},
      "North America":{},
      "South America":{},
      Europe:{},
      Oceania:{}
    };

lr.on('error', function (err) {
  console.log(err);
});

lr.on('line', function (line) {
	// 'line' contains the current line without the trailing newline character.
  if(flag==0)
  {
    heading = line.split(','); //spliting the heading part
    flag=1;


    fs1.readFile('./../data/Countries-Continents.csv', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }

      var data1 = data.split('\r\n');

      for(var i=1;i<data1.length;i++)
      {
        var each_word=data1[i].split(',');

          obj1[each_word[1]]=each_word[0];

      }
      //console.log(obj1);

    });
  }
  else
  {

        var words = line.split(',');
        var k=0;
        var temp_str="";
        for(var j=0;j<words.length;j++)                                              //traversing  the completeing the word
        {
          if(words[j].charAt(0)=='"')                                                 //if any word's first letter is "
          {
            k=0;
            temp_str=words[j]
            do
            {
              k++;
              temp_str=temp_str.concat(","+words[j+k]);
            } while(words[j+k].charAt(words[j+k].length-1)!='"')
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



      if((words[2]=="GDP per capita (constant 2005 US$)") && (continent[obj1[words[0]]] !== undefined))
      {

        for(var i=4;i<words.length;i++)
        {
              if(words[i]=="")
                {
                  continent[obj1[words[0]]][heading[i]]= isNaN(parseInt(continent[obj1[words[0]]][heading[i]]))?0:(parseInt(continent[obj1[words[0]]][heading[i]]));

                }
              else
                {
                  continent[obj1[words[0]]][heading[i]]= isNaN(parseInt(continent[obj1[words[0]]][heading[i]]))?0:(parseInt(continent[obj1[words[0]]][heading[i]]))+parseInt(words[i]);

                }
        }

      }

  }
});

lr.on('end', function () {



  fs1.writeFile("./../data/continentGdpAggrigate.json", JSON.stringify(continent) , function(err) {
    if(err) {
        return console.log(err);
    }
  });

});
