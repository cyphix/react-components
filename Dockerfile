# syntax=docker/dockerfile:1

# --- Storybook build ---
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_MOCK_API=true
ENV VITE_MOCK_API=$VITE_MOCK_API
RUN pnpm build

# --- Static server ---
FROM nginx:1.29-alpine
ARG APP_VERSION=dev
LABEL org.opencontainers.image.source="https://github.com/cyphix/react-components" \
      org.opencontainers.image.title="react-components" \
      org.opencontainers.image.version="${APP_VERSION}"
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/storybook-static /usr/share/nginx/html
EXPOSE 80
