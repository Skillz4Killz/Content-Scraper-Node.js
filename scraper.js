// http://shirts4mike.com/          http://shirts4mike.com/shirts.php
'use strict';

const cheerio = require("cheerio");
const tinyreq = require("tinyreq");
const scrapeIt = require("scrape-it");
const url = "http://shirts4mike.com/shirts.php";
const urlMain = "http://shirts4mike.com/";
let pages = [];
let page1, page2, page3, page4, page5, page6, page7, page8;

// Define the scrape function
function scrape(url, data, cb) {
    // 1. Create the request
    tinyreq(url, (err, body) => {
        if (err) { return cb(err); }

        // 2. Parse the HTML
        let $ = cheerio.load(body)
          , pageData = {}
          ;

        // 3. Extract the data
        Object.keys(data).forEach(k => {
            pageData[k] = $(data[k]).text();
        });

        // Send the data in the callback
        cb(null, pageData);
    });
}
 
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
});

//scrape the necessary info from each url

 
