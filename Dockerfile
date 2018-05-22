# Build Stage
FROM node:8-alpine AS build
ARG BuildPath=/usr/src/app
ENV NODE_ENV production
WORKDIR $BuildPath
COPY . .
RUN yarn install --production
RUN yarn run build

# Serve Stage
FROM nginx:stable-alpine
ARG BuildPath=/usr/src/app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build $BuildPath/build /usr/share/nginx/html
EXPOSE 80
