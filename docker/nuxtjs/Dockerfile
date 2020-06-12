# Node ver 12.16.1 LTS @2020/03
# Alpine Linux
FROM node:12.16.1-alpine

# linux Update, set Timezone, install bash
RUN apk --update add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && \
    apk add --no-cache bash

# japanese font
RUN apk add --no-cache curl fontconfig font-noto-cjk && \
    fc-cache -fv

# Installs latest Chromium (76) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# npm Update, install nuxt
RUN npm install -g npm && \
    npm install -g nuxt create-nuxt-app --no-optional

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \ && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

# 作業ディレクトリ作成
WORKDIR /app

ENV HOST 0.0.0.0
EXPOSE 8080
