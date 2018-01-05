//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");

var jsonObj;

//             ------------------------------ Read text file ------------------------------------------------------  
var readDataFromFile = function () {

	fs.readFile('./db/data.txt', 'utf8', function (err, contents) {
		if (err) {
			console.log("ERROR reading tradeHistory.txt file!!!");
			console.log(err);
			// res.send(err);
		}
		else {
			console.log('--------- String Content from TXT file ---------');
			console.log(contents);
			jsonObj = JSON.parse(contents);
			console.log('--------- JSON Content from TXT file ---------');
			console.log(jsonObj);
			// jsonObj.forEach(function(element) {
			// 	console.log(element);
			// }, this);

			// send data to front end
			// res.send(jsonObj);
		}
	});
}


// var jsonData = [{
// 	"Id": 1,
// 	"Name": "Adesh",
// 	"Salary": 10000
// },
// {
// 	"Id": 2,
// 	"Name": "Abhishek",
// 	"Salary": 20000
// }]

var writeDataToFile = function (jsonData) {
	var data = JSON.stringify(jsonData);
	fs.writeFile('./db/data.txt', data, function (err) {
		if (err) {
			return console.error(err);
		}

		console.log("Data written successfully!");

		console.log("Read data 2");
		readDataFromFile();
	});
}


console.log("Read data 1");
var contents = fs.readFileSync('./db/data.txt');
// console.log(contents.toString());

jsonData = JSON.parse(contents);
console.log(jsonData)

var d = {
	Id: 1,
	Name: "Test",
	Salary: 4500
}

jsonData.push(d);
console.log('----- Push new data -----------')
console.log(jsonData)

console.log("Write data ");
writeDataToFile(jsonData);


