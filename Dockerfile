FROM node:erbium-alpine AS build
WORKDIR /project/
COPY package*.json ./
RUN apk add git && npm install
COPY ./ ./
RUN npm run build-ts
EXPOSE 3333
ENTRYPOINT ["npm", "run", "watch"]

FROM node:erbium-alpine
WORKDIR /server/
COPY --from=build /project/package*.json ./
RUN apk add git && npm ci --only=production
COPY --from=build /project/build/ ./build/
EXPOSE 3333
ENTRYPOINT ["npm", "start"]
