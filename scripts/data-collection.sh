#!/bin/bash

append_empty_data_entry(){
    # function to create an entry with empty fields when speedtest returns an error
    echo '{"download": "", "upload": "", "ping": "", "server": {"url": "", "lat": "", "lon": "", "name": "", "country": "", "cc": "", "sponsor": "", "id": "", "host": "", "d": "", "latency": ""}, "timestamp": "$(date -u -Ins)", "bytes_sent": "", "bytes_received": "", "share": "", "client": {"ip": "", "lat": "", "lon": "", "isp": "", "isprating": "", "rating": "", "ispdlavg": "", "ispulavg": "", "loggedin": "", "country": ""}}]' >> /srv/share/internet-speed-tracker/data/data.lock
}

# Prevent script from intering with web request
cp /srv/share/internet-speed-tracker/data/data.json /srv/share/internet-speed-tracker/data/data.lock

# Remove closing bracket and replace with comma to prepare for additional data
sed -i '$ s/\]/,/' /srv/share/internet-speed-tracker/data/data.lock

# Append speedtest data and close bracket
speedtest --json >> /srv/share/internet-speed-tracker/data/data.lock 2>> /srv/share/internet-speed-tracker/scripts/error.log
if [ $? = 0 ]; then
    # close array with bracket
    sed -i '$ s/$/]/' /srv/share/internet-speed-tracker/data/data.lock
else
    # print empty data to file instead
    append_empty_data_entry
fi

# Put the new data in place to be requested
mv /srv/share/internet-speed-tracker/data/data.lock /srv/share/internet-speed-tracker/data/data.json
