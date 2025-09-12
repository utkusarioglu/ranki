#!/bin/bash

for f in config ignore text v2 v1; do
  cat assets/ohm/2.0.46/$f.ohm
  echo
done
