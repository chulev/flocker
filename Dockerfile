FROM ghcr.io/fboulnois/pg_uuidv7:1.5.0 as extensions
COPY scripts/create-db-extensions.sql /docker-entrypoint-initdb.d/

FROM imbios/bun-node:1.0.35-21.7.1-alpine as base
WORKDIR /app
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS dev
COPY --from=base /temp/dev/node_modules node_modules
COPY . .
