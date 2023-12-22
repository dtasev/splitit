#!/bin/bash

set -ex
source ./base.sh

docker push ${image_name}
docker push ${image_repo}:latest
