FROM alpine

# Installs latest Chromium (100) package.
RUN apk add --no-cache --update \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      npm

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

ADD . /var/www/guruto
WORKDIR /var/www/guruto

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]