#!/bin/bash

# tcneko <tcneko@outlook.com>
# create: 2017.04
# last update: 2019.02
# last test environment: ubuntu 18.04
# description:

export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin

# variables

# function

# main
src_list=$(find ./ -name "${1}*.csv")

if [ -z "${1}" -o -z "$src_list" ]; then
    exit 1
fi

cat ${1}_table.sql >${1}.sql
for csv in $src_list; do
    file -bi $csv | grep utf &>/dev/null
    if [ $? -ne 0 ]; then
        iconv -f GBK -t utf-8 $csv -o $csv
    fi
    dos2unix $csv 2>/dev/null
    sed "1d" $csv | sed "s/^/INSERT INTO $1 VALUES ('/;s/,/','/g;s/$/');/" |
        sed "s/'\([0-9]\+\)'/\1/g;s/''/?/g" |
        sed "s/\"\"\"/\"/g" >>${1}.sql
    echo >> ${1}.sql
done

exit 0
