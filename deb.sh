p=$(pwd)
cd $p/src/packages/dqm-v2-debug && yarn clean-all && yarn build &&
cd $p/src/apps/dqm-v2-console && yarn preview-console trn --print | yq

# cd $p/src/apps/dqm-v2-demo && yarn bundle && 
