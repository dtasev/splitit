#!/bin/bash

set -ex
source ./base.sh

docker build -t ${image_name} -f Dockerfile .
docker run -t -v $(pwd)/app:/app:rw -w /app ${image_name} /bin/bash -c "npm install && npx vite build $1 $2"
