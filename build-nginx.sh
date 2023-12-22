#!/bin/bash

set -ex
source ./base.sh

docker build -t ${image_name} -f deploy/Dockerfile .
docker tag ${image_name} ${image_repo}:latest

echo ${image_name} > splitit.txt
