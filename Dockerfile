# syntax=docker/dockerfile:1
#
# NOTE: This project uses a custom Express server (server.js), which Next.js
# docs explicitly say is incompatible with `output: "standalone"` ("these
# cannot be used together" - https://nextjs.org/docs/app/guides/custom-server).
# So this image copies production node_modules instead of standalone tracing.

ARG NODE_VERSION=22-slim

# ---- deps: full install for build ----
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  corepack enable && pnpm install --frozen-lockfile

# ---- builder: compile Next.js (output goes to dist/, see next.config.ts) ----
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time.
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_DATABASE_URL
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID \
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=$NEXT_PUBLIC_FIREBASE_DATABASE_URL \
    NEXT_PUBLIC_FIREBASE_MEASUREMENT=$NEXT_PUBLIC_FIREBASE_MEASUREMENT \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && pnpm build

# ---- prod-deps: production-only node_modules for runtime ----
FROM node:${NODE_VERSION} AS prod-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  corepack enable && pnpm install --frozen-lockfile --prod

# ---- runner: final runtime image ----
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=5172

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/public ./public
COPY --chown=node:node package.json next.config.mjs server.js ./

# Upload target for /api/upload; mounted as a volume in docker-compose.yml
# so uploaded project images survive image rebuilds/container recreation.
RUN mkdir -p public/asset/projects && chown -R node:node public/asset/projects

USER node
EXPOSE 5172
CMD ["node", "server.js"]
