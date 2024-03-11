FROM ghcr.io/fboulnois/pg_uuidv7:1.5.0 as extensions
COPY scripts/create-db-extensions.sql /docker-entrypoint-initdb.d/
