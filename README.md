# internet-speed-tracker

A simple webpage to visualize internet download speeds over time. Built with D3.

### To Deploy
* Download repo
* Install web server
* Copy contents of web folder to /var/www/html
* Add this to crotab of a user that can write to the webserver: `0 * * * * /path/to/internet-speed-tracker/data-collection.sh`
