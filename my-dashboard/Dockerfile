# ---- Stage 1: build the Vite/React static assets ----
ARG IMAGE_PLATFORM=linux/amd64
FROM --platform=$IMAGE_PLATFORM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: provide Dynatrace OneAgent code modules ----
FROM --platform=$IMAGE_PLATFORM qkz58401.live.dynatrace.com/linux/oneagent-codemodules:nodejs AS oneagent

# ---- Stage 3: run the Express server ----
FROM --platform=$IMAGE_PLATFORM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Only install production deps (express, etc.) - skip devDependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Bring in the server entrypoint and the built static assets
COPY server.js ./server.js
COPY src/mockData.js src/serverMetrics.js ./src/
COPY --from=build /app/dist ./dist

# --- OneAgent injection (application-only monitoring) ---
COPY --from=oneagent / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

EXPOSE 3000
CMD ["node", "server.js"]
