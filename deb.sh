p=$(pwd)
cd $p/src/packages/dqm-v2-debug && yarn clean-all && yarn build &&
cd $p/src/apps/dqm-v2-demo && yarn bundle && 
cd $p/src/apps/dqm-v2-console && yarn preview-console cpx --print
