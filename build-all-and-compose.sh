set -ex

cd backend && bash build.sh $1
cd ../nginx && bash build.sh $1
cd .. && docker-compose up -d