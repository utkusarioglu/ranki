source "${0%/*}/../.env"

function copy {
  list="$(echo $(find ./src -maxdepth 1 -not -type d))"
  cp $list "${ANKI_MEDIA_PATH}/"
}

function main {
  declare seconds="$1"

  if [ -z "$seconds" ]; then
    copy
    exit 0
  fi
  
  while [ true ]; do
    echo "Copying at: $(date '+%H:%M:%S')"
    copy

    sleep $seconds
  done
}

main $@
