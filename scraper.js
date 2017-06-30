//Developed By: Skillz4Killz
'use strict';
//require all necessary files
const scrapeIt = require("scrape-it");
const jsoncsv = require('json-csv');
const fs = require("fs");
const es = require("event-stream");
//all necessary variables
const urlMain = "http://shirts4mike.com/";
const url = "http://shirts4mike.com/shirts.php";
let page1, page2, page3, page4, page5, page6, page7, page8;
let pages = [];
let shirtInfo = [];
let makeCsv = [];
let date = new Date();
date = date.toISOString().slice(0,10);

//check if data folder exists if not log the error and make folder then run the scrape, if it exists then skip and just run the scrape.
if (!fs.existsSync('./data')){
	fs.appendFile('scraper-error.log', `${new Date()} : There was no folder called 'data', so I made one for you. Cheers!\n`, (err) => {
		  if (err) throw err;
	});
  fs.mkdirSync('./data');
  beginScrape();
} else {
	beginScrape();
}

// Promise interface to scrape the links for each shirt and create urls for each 
function beginScrape () {
	scrapeIt(url, {
		pageLinks: {
      listItem: ".products li",
	      data: {
          links: {
            selector: "a",
            attr: "href"
	        }
	      }
	  }
	}).then(data => { 
		let shirtLinks = data;
//create a url for each individual shirt
		shirtLinks.pageLinks.forEach(function(element) {
			pages.push(element.links);
		})
		page1 = `${urlMain}${pages[0]}`;
		page2 = `${urlMain}${pages[1]}`;
		page3 = `${urlMain}${pages[2]}`;
		page4 = `${urlMain}${pages[3]}`;
		page5 = `${urlMain}${pages[4]}`;
		page6 = `${urlMain}${pages[5]}`;
		page7 = `${urlMain}${pages[6]}`;
		page8 = `${urlMain}${pages[7]}`;
		pages = [page1, page2, page3, page4, page5, page6, page7, page8];
//search on each shirt page for necessary info and scrape it.
		pages.forEach(function(element){
			scrapeIt(element, {
				title: {
		      selector: "title"
		    },
		    price: {
			      selector: ".price"
			    },
		    image: {
		      selector: "img",
		      attr: "src"
		  	},
			}).then(data => { 
				shirtInfo = data;
//add a url, imageURL, and time to the json
				shirtInfo.url = element;
				shirtInfo.image = `${urlMain}${shirtInfo.image}`;
				shirtInfo.time = new Date();
//push the shirtInfo object into an array of objects
				makeCsv.push(shirtInfo);
				console.log(date);
//create the options for csv file
			var options = {
			  fields : [
					{
		        name : 'title',
		        label : 'Title',
			    },
			    {
		        name : 'price',
		        label : 'Price'
			    },
			    {
		        name : 'image',
		        label : 'ImageURL'
			    },
			    {
		        name : 'url',
		        label : 'URL'
			    },
			    {
		        name : 'time',
		        label : 'Time'
			    }]
			  }
// create a file inside the data folder with current date in required format and insert the data
			var out = fs.createWriteStream(`data/${date}.csv`, {encoding: 'utf8'})
			var readable = es.readArray(makeCsv)
			readable
			  .pipe(jsoncsv.csv(options))
			  .pipe(out)
			});
		})
// if the site isnt found throw a 404 error and log it.
	}).catch(function(){
		console.log("There's been a 404 error. Cannot connect to the to http://shirts4mike.com.");
		fs.appendFile('scraper-error.log', `${new Date()} : There's been a 404 error. Cannot connect to the to http://shirts4mike.com.\n`, (err) => {
		  if (err) throw err;
		});
	});
}