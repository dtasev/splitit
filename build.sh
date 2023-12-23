#!/bin/bash

set -ex
source ./base.sh

docker build -t ${image_name} -f Dockerfile .
docker tag ${image_name} $image_repo:latest
docker run -t -v $(pwd)/app:/app:rw -w /app ${image_name} /bin/bash -c "npm install && npx vite build $1 $2"
cd app && tar -czvf archive_name.tar.gz folder_name && cd ..