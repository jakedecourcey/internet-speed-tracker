# internet-speed-tracker

A simple webpage to visualize internet download speeds over time

### To Deploy
* Download repo to home directory
* Install web server (and make yourself able to write in it)
* Allow links in webserver directory (for nginx `echo "disable_symlinks off;" >> /etc/nginx/nginx.conf`) 
* Add this to your user's crotab: `0 * * * * $HOME/internet-speed-tracker/data-collection.sh`
* Change `scripts/deploy.sh` "here" variable to the correct location
* Run ./scripts/deploy.sh
