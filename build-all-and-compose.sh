set -ex

cd backend && bash build.sh
cd ../nginx && bash build.sh
cd .. && docker-compose up