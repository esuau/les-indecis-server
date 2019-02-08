FROM node:8.9.3-alpine
RUN mkdir -p /usr/src/app
COPY ./app/* /usr/src/app/
WORKDIR /usr/src/app
EXPOSE 80
RUN mkdir -p /usr/shared/bill
VOLUME /usr/shared/bill
RUN npm install
CMD node /usr/src/app/index.js
