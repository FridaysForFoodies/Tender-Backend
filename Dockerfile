FROM node:lts-alpine AS dev
COPY . /project/
WORKDIR /project/
ENTRYPOINT npm install && npm run watch

FROM node:lts-alpine
RUN apk add git
COPY --from=dev /project/package.json /project/package-lock.json /
RUN npm install --production
COPY --from=dev /project/build/ /build/
ENTRYPOINT npm start
