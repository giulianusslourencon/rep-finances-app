FROM node:14.15.3-alpine3.12 AS build

COPY . .
RUN yarn install
RUN yarn audit
RUN yarn run build


FROM node:14.15.3-alpine3.12
COPY --from=build dist .
COPY --from=build node_modules ./node_modules

ENTRYPOINT [ "node" ]
CMD [ "main/server.mjs" ]
