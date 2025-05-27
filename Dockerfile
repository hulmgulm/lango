FROM node:22-alpine
WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app/ .
COPY scripts/entrypoint.sh entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]