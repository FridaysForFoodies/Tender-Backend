FROM node:erbium-alpine AS build
COPY . /project/
WORKDIR /project/
RUN apk add git && npm install && npm run build-ts
ENTRYPOINT ["npm", "run", "watch"]

FROM node:erbium-alpine
RUN apk add git
COPY --from=build /project/package.json /project/package-lock.json /
RUN npm install --production
COPY --from=build /project/build/ /build/
ENTRYPOINT ["npm", "start"]
