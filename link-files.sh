#!/bin/bash

files=("index.html" "js/scripts.js" "css/styles.css" "data.json")

here="/srv/share/internet-speed-tracker"
nginx="/var/www/html"

for file in "${files[@]}";do
  ln -sf "${here}/${file}" "${nginx}/${file}"
done
