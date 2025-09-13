#!/bin/bash

version=2.0.57
files=(
  1-config
  2-basic
  3-rich-text
  3-rich-number
  3-frame-v2
  3-frame-v1
  4-math
)

for f in ${files[@]}; do
  cat assets/ohm/${version}/${f}.ohm
  echo
done
