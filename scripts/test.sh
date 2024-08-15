ERROR_TEST_FILE_REQUIRED='Test file name is required as the first param'

function main {
  test_file=${1:?ERROR_TEST_FILE_REQUIRED}
  docker run \
    -v $(pwd):/workdir \
    node:alpine \
    sh -c "node /workdir/tests/${test_file}.test.js"
}

main $@
