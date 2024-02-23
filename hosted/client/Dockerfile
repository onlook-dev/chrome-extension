# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Copy files to container and build
COPY project .
RUN bun install
ENTRYPOINT [ "bun", "run", "dev" ]
