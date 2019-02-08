#!/bin/bash

# tcneko <tcneko@outlook.com>
# create: 2018.02
# last update: 2018.10
# last test environment: Ubuntu 18.04
# description:

export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin

set -e

# variables
install_dir='/opt/www/ajisai'
source_dir="$(dirname $0)"

# function

# main
if [ $UID -ne 0 ]; then
    exit 1
fi
if [ ! -d $install_dir ]; then
    mkdir $install_dir
fi
cp -rf ${source_dir}/css \
    ${source_dir}/js \
    ${source_dir}/php \
    ${source_dir}/*.html \
    ${install_dir}/

chmod -R go-w ${install_dir}

exit 0
