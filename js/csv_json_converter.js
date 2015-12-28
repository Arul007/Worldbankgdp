fs = require('fs');
var csvdata = fs.readFileSync("rawdata.csv", 'utf8', function (err,data) {
  if (err) {
    return err;
  }
   return data;
});

var output;

function csvJSON(csv){

  var lines=csv.split("\n");   // To split csv file lines with new lines
    /*Below line of code will be applicable for csv file with header
    * Assuming first line of the file contains csv header data
    *Splitting it with comma delimiter
    */
    var headers=lines.split(",");
    var indicatorname = {};
    for(var i=1;i<lines.length;i++){
        var obj = {}; // Map variable to store key-value pair
        //var result = [];
      //Below line has regex to split lines with comma omitting comma inside content
  	  var currentline=lines[i].match(/((".*?"|[^",\s]+)(?=\s*,|\s*$))/g);

        //After header line contains n lines of actual data
  	     for(var j=0;j<headers.length;j++){
            if( !indicatorname[currentline[2]] )
            indicatorname[currentline[2]]  = [];
            obj[headers[0]] = currentline[0];
            obj[headers[1]] = currentline[1];
  	      }
      //  result.push(obj)
        indicatorname[currentline[2]].push(obj);
  	   }

    return JSON.stringify(indicatorname); //JSON


}

output=csvJSON(csvdata);

fs.writeFile("output.txt", output);
