#!/bin/sh

cd "$(dirname "$0")" || exit 1 # cd to the script directory or exit if failed

# run the app and pass the second argument to the app
echo $(python main.py $1)
