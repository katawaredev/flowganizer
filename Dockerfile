# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /flowganizer

ADD package.json package-lock.json .npmrc ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /flowganizer

COPY --from=deps /flowganizer/node_modules /flowganizer/node_modules
ADD package.json package-lock.json .npmrc ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /flowganizer

COPY --from=deps /flowganizer/node_modules /flowganizer/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="8080"
ENV NODE_ENV="production"

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /flowganizer

COPY --from=production-deps /flowganizer/node_modules /flowganizer/node_modules
COPY --from=build /flowganizer/node_modules/.prisma /flowganizer/node_modules/.prisma

COPY --from=build /flowganizer/build /flowganizer/build
COPY --from=build /flowganizer/public /flowganizer/public
COPY --from=build /flowganizer/package.json /flowganizer/package.json
COPY --from=build /flowganizer/start.sh /flowganizer/start.sh
COPY --from=build /flowganizer/prisma /flowganizer/prisma

ENTRYPOINT [ "./start.sh" ]