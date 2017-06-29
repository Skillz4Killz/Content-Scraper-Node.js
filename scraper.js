var scrape = require('website-scraper');
var options = {
  urls: ['http://shirts4mike.com/'],
  directory: './data/',
};
 
// with promise 
scrape({
	urls: [{'http://shirts4mike.com/', filename: index.html},
			{'http://shirts4mike.com/shirts.php', filename: shirts.html}],
	directory: './data/',
}).then((result) => {
    /* some code here */
}).catch((err) => {
    /* some code here */
});
 
// or with callback 
scrape(options, (error, result) => {
    /* some code here */
});