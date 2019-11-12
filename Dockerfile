# Stage0 "build-stage", based on Node.js, to build and compile the frontend
FROM node:9.11.2 as build-stage
# Create app directory
ENV APP_WORKDIR=/usr/src/app
WORKDIR $APP_WORKDIR

RUN npm i -g npm@4.6.1

# Copy dependency
ADD package.json $APP_WORKDIR
ADD nginx.conf $APP_WORKDIR 
RUN yarn install --pref-offline
#RUN npm install

# Bundle app source!
COPY . .

# Run Application in dev mode
#CMD ["npm", "start"]

RUN yarn run build
#RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /usr/src/app/dist/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

