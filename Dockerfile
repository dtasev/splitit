FROM node:21.1.0-bookworm

WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin
CMD npm run dev