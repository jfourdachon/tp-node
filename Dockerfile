FROM node:14.9-slim as build-api

# Install node_modules
COPY package.json yarn.lock /tmp/
WORKDIR /tmp
RUN yarn && mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

#####

FROM node:14.9-slim

# Set a working directory
WORKDIR /usr/src/app

COPY --from=build-api /usr/src/app/ /usr/src/app

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
