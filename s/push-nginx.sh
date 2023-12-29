#!/bin/bash

set -ex
source ./s/base.sh

docker push ${image_name}
docker push ${image_repo}:latest
