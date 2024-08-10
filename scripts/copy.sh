source "${0%/*}/../.env"

list="$(echo $(find ./src -maxdepth 1 -not -type d))"
cp $list "${ANKI_MEDIA_PATH}/"
