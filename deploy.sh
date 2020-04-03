#!/bin/bash

files=("index.html" "js/scripts.js" "js/d3.min.js" "css/styles.css" "data/data.json")

here="/srv/share/internet-speed-tracker"
nginx="/var/www/html"

for file in "${files[@]}";do
  ln -sf "${here}/${file}" "${nginx}/${file}"
done
