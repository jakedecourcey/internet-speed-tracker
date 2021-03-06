#!/bin/bash

DATA=/var/www/html/data.json
LOCK=/var/www/html/data.lock
BACKUP=/srv/share/speed-test-data.json

# Seed file if necessary
if [ ! -f $DATA ]; then
    echo "[" >> $DATA
fi

append_empty_data_entry(){
    # function to create an entry with empty fields when speedtest returns an error
    echo '{"download": "", "upload": "", "ping": "", "server": {"url": "", "lat": "", "lon": "", "name": "", "country": "", "cc": "", "sponsor": "", "id": "", "host": "", "d": "", "latency": ""}, "timestamp": "'$(date -u -Ins)'", "bytes_sent": "", "bytes_received": "", "share": "", "client": {"ip": "", "lat": "", "lon": "", "isp": "", "isprating": "", "rating": "", "ispdlavg": "", "ispulavg": "", "loggedin": "", "country": ""}}]' >> $LOCK
}

# Prevent script from intering with web request
cp $DATA $LOCK

# Remove closing bracket and replace with comma to prepare for additional data
sed -i '$ s/\]/,/' $LOCK

# Append speedtest data and close bracket
speedtest --json >> $LOCK
if [ $? = 0 ]; then
    # close array with bracket
    sed -i '$ s/$/]/' $LOCK
else
    # print empty data to file instead
    append_empty_data_entry
fi

# Put the new data in place to be requested
mv $LOCK $DATA

# Backup data
cp $DATA $BACKUP
