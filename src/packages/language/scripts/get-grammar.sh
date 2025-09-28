#!/bin/bash

base_gitpath=assets/ohm
target_basename="all.ohm"

# ANKI
version=$(find ${base_gitpath} -mindepth 1 -type d | sort | tail -n1 | xargs basename)

files=$(find ${base_gitpath}/${version} -not -name all.ohm -not -type d | sort)

function compile_ohm() {
  version_gitpath="${base_gitpath}/${version}"
  target_gitpath="${version_gitpath}/${target_basename}"

  echo "// ${version}" > $target_gitpath
  
  for file_gitpath in ${files[@]}; do
    if [ ! -f $file_gitpath ]; then
      echo "$file_gitpath doesn't exist"
      exit 1
    fi

    cat $file_gitpath >> $target_gitpath
    echo "" >> $target_gitpath

    echo "${file_gitpath} done"
  done
}

compile_ohm
