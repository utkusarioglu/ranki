p=$(pwd)
cd $p/src/packages/dqm-v2-debug && yarn build &&
cd $p/src/apps/dqm-v2-console && yarn preview-console &&
cd $p/src/apps/dqm-v2-demo && yarn bundle
