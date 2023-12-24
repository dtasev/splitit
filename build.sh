#!/bin/bash

set -ex
source ./base.sh

docker build -t ${image_name} -f Dockerfile .
docker tag ${image_name} $image_repo:latest

if [ "$1" = "--push" ] ; then
    docker push $image_name
    docker push $image_repo:latest
else
    docker run -t -v $(pwd)/app:/app:rw -w /app ${image_name} /bin/bash -c "npm install && npx vite build $1 $2"
fi