#!/bin/bash

mkdir /var/www/html/js /var/www/html/css /var/www/html/data

files=("index.html" "js/scripts.js" "js/d3.js" "css/styles.css" "data/data.json")

here=$HOME/internet-speed-tracker
nginx=/var/www/html

for file in "${files[@]}";do
  ln -sf "${here}/${file}" "${nginx}/${file}"
done
