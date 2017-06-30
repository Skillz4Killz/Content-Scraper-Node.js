// http://shirts4mike.com/          http://shirts4mike.com/shirts.php
'use strict';

const cheerio = require("cheerio");
const tinyreq = require("tinyreq");
const scrapeIt = require("scrape-it");
const jsoncsv = require('json-csv');
const fs = require("fs");
const es = require("event-stream");
const url = "http://shirts4mike.com/shirts.php";
const urlMain = "http://shirts4mike.com/";
let date = new Date();
let pages = [];
let page1, page2, page3, page4, page5, page6, page7, page8;
let shirtInfo = [];
let makeCsv = [];
 
// Promise interface to scrape the links for each shirt and create urls for each 
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
				shirtInfo.url = element;
				shirtInfo.image = `${urlMain}${shirtInfo.image}`;
				shirtInfo.time = new Date();
				makeCsv.push(shirtInfo);
					console.log(makeCsv);
				

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

						var out = fs.createWriteStream(`${date.getFullYear().toString()}-${(date.getMonth()+1).toString()}-${date.getDate().toString()}.csv`, {encoding: 'utf8'})
						var readable = es.readArray(makeCsv)
						readable
						  .pipe(jsoncsv.csv(options))
						  .pipe(out)


		});
	})
});



			

 
