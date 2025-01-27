#!/bin/bash

# su - <<EOF
# root

# echo "Enabling corepack…"
# corepack enable

# echo
# echo "Setting yarn version…"
# yarn set version stable
# yarn --version
# EOF

# cd /workdir
# echo "Installing dependencies…"
# yarn
# while [ $? -ne 0 ]; do
#   echo "Retrying"
#   yarn
# done


yarn
