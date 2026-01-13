#!/bin/bash

set -ev

[ "$1" == "clean" ] && yarn clean-all 
yarn build
# clear 
# output=$(yarn console--v2 $@)
# ANKI
# echo "${output}" | (yq e '.' - 2>/dev/null || echo "${output}")
