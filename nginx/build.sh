set -ex

branch="$(git symbolic-ref --short HEAD)"
sha="$(git rev-parse --short HEAD)"
tag="${branch}-${sha}"
image_repo="dtasev/splitit-nginx"
image_name="${image_repo}:${tag}"

docker build -t $image_name -f Dockerfile .
docker tag $image_name $image_repo:latest

if [ "$1" = "--push" ] ; then
    docker push $image_name
    docker push $image_repo:latest
fi