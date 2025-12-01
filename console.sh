#!/bin/bash

set -ev

[ "$1" == "clean" ] && yarn clean-all 
yarn build
clear 
yarn console--v2
