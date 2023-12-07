#!/bin/sh

# get the directory of the script
script_dir="$(dirname "$0")"
cd $script_dir || exit 1 # cd to the script directory or exit if failed

# run the app and pass the second argument to the app
echo $(python main.py $1)