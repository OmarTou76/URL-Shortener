FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm@latest

RUN pnpm install

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

CMD ["/entrypoint.sh"]
