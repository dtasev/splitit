#!/bin/bash

set -ex
source ./base.sh

docker build -t $image_name -f Dockerfile .

docker run --network=efas_default -p5999:5173 --name splitit --rm -v $(pwd)/app:/app:rw -it $image_name $1
