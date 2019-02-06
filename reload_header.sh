#!/bin/bash

# tcneko <tcneko@outlook.com>
# create: 2018.12
# last update:
# last test environment: ubuntu
# description:

export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin

# variables
src_file='html/header.html'
end_dentifier='__end_dentifier__'
dst_file='index.html kana.html tango.html'

# function
reload_header() {
    for ix in $dst_file; do
        end_line=$(grep -n $end_dentifier $ix | cut -d ':' -f 1)
        if [ -z $end_line ]; then
            continue
        fi
        cp $ix ${ix}.bak
        sed "1,${end_line}d" ${ix}.bak | sed "1 r $src_file" | sed '1d' > $ix
        rm -f ${ix}.bak
    done
}

# main
reload_header

exit 0
