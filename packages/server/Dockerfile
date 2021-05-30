FROM node:lts-alpine AS build

COPY . .
RUN yarn install
RUN yarn global add swagger-cli
RUN yarn audit
RUN yarn run build


FROM node:lts-alpine
COPY --from=build dist .
COPY --from=build swagger.yaml .
COPY --from=build node_modules ./node_modules

ENTRYPOINT [ "node" ]
CMD [ "main/server.mjs" ]
