#!/bin/sh

# Removes the path mounted as /target from the expected bundle files. 
# Anki does not sync media files based on modified date. It does the quickest
# job if the files are removed an readded. 
# Cleaning them helps with speeding up the sync.
name='_ranki*'

echo "Removing $name from /target…"
find /target -maxdepth 1 -name $name -exec rm {} + 
