FROM ghcr.io/fboulnois/pg_uuidv7:1.5.0 as extensions
COPY scripts/create-db-extensions.sql /docker-entrypoint-initdb.d/

FROM imbios/bun-node:latest-current-alpine as base
WORKDIR /app
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS dev
COPY --from=base /temp/dev/node_modules node_modules
COPY . .
