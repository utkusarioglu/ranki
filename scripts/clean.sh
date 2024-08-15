source "${0%/*}/../.env"

find "${ANKI_MEDIA_PATH}" \
  -maxdepth 1 \
  -name '_ranki*' \
  -exec rm {} +
