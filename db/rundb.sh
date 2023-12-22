set -ex

image_name=dtasev/splitit:db

docker build -t $image_name -f Dockerfile .