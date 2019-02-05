#!/bin/bash

# tcneko <tcneko@outlook.com>
# create: 2017.04
# last update: 2019.01
# last test environment: ubuntu
# description:

export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin

# variables

# function

# main
cat ${1}_table.sql > ${1}.sql
for csv in `find ./ -name "${1}*.csv"`
do
    if `file -bi $csv | grep utf &> /dev/null`
    then
        :
    else
        iconv -f GBK -t utf-8 $csv -o $csv
    fi
    dos2unix $csv 2> /dev/null
    sed "1d" $csv | sed "s/^/INSERT INTO $1 VALUES ('/;s/,/','/g;s/$/');/" | 
    sed "s/'\([0-9]\+\)'/\1/g;s/''/?/g" |
    sed "s/\"\"\"/\"/g" >> ${1}.sql
done

exit 0
