#!/bin/bash
cat sample.log | while read line
  do
    echo "$line" >/dev/udp/127.0.0.1/41234
  done
