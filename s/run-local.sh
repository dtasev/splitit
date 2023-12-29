#!/bin/bash

set -ex
source ./s/base.sh

docker build -t $image_name -f Dockerfile .
docker tag ${image_name} $image_repo:latest
docker run -p5999:5173 --name splitit-react --rm -v $(pwd)/app:/app:rw -it $image_name $1
