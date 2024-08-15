source "${0%/*}/../.env"

find "/target" \
  -maxdepth 1 \
  -name '_ranki*' \
  -exec rm {} +
