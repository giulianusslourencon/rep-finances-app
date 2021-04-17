FROM node:current-alpine AS build

COPY . .
RUN yarn install
RUN yarn audit
RUN yarn run build


FROM node:current-alpine
COPY --from=build dist .
COPY --from=build node_modules ./node_modules

ENTRYPOINT [ "node" ]
CMD [ "main/server.mjs" ]
