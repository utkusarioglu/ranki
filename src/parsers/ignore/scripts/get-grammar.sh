#!/bin/bash

version=2.0.58

base_relpath=assets/ohm

target_relpath="all.ohm"

files=(
  1-config
  2-base
  3-rich-text
  3-rich-number
  3-rich-structure
  3-frame-v2
  3-frame-v1
  4-math
)


function compile_ohm() {
  version_relpath="${base_relpath}/${version}"
  target_abspath="${version_relpath}/${target_relpath}"

  echo "// ${version}" > $target_abspath
  
  for file_relpath in ${files[@]}; do
    file_abspath="${version_relpath}/${file_relpath}.ohm"

    if [ ! -f $file_abspath ]; then
      echo "$file_abspath doesn't exist"
      exit 1
    fi

    cat $file_abspath >> $target_abspath
    echo "" >> $target_abspath

    echo "${file_abspath} done"
  done
}

compile_ohm
