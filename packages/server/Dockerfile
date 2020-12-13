FROM node:12.14.1-alpine3.11 AS build

COPY . .
RUN yarn install
RUN yarn audit
RUN yarn run build


FROM node:12.14.1-alpine3.11
COPY --from=build dist .
COPY --from=build node_modules ./node_modules

ENTRYPOINT [ "node" ]
CMD [ "server.js" ]
