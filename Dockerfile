# Build Stage
FROM node:8-alpine AS build
ARG BuildPath=/usr/src/app
WORKDIR $BuildPath
COPY . .
RUN yarn install
ENV NODE_ENV production
RUN yarn run build

# Serve Stage
FROM nginx:stable-alpine
ARG BuildPath=/usr/src/app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build $BuildPath/build /var/www
EXPOSE 8080
