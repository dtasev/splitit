set -ex

# we're not building the frontend here because npm runs out of memory on the tiny google pod
# instead it's built into the github action and the dist/ copied.

cd backend && bash build.sh $1
cd ../nginx && bash build.sh $1
cd .. && docker compose up -d