#!/bin/bash

# tcneko <tcneko@outlook.com>
# create: 2019.02
# last update: 
# last test environment: ubuntu 18.04
# description:

export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin

# variables
db_path='./jp.db'

# function

# main
./csv2sql.sh tango
sqlite3 $db_path < tango.sql

exit 0
