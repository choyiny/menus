# stage 1: compile the angular app
FROM node:13-alpine as build-app
WORKDIR /usr/src/app
COPY package*.json ./
COPY .npmrc ./
RUN npm install
COPY . .

RUN npm run build:prod

# Stage 2: serving the actual app
FROM nginx:alpine
COPY --from=build-app /usr/src/app/dist/menu-app /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
