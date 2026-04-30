
# URL-Shortener

Full stack URL shortening application

## Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose

## Local Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/OmarTou76/URL-Shortener.git
   cd URL-Shortener
   ```

2. Rename or copy .env files name :

   ```bash
   mv .env.example .env
   mv web/.env.example web/.env
   ```
   or 

   ```bash
   cp .env.example .env
   cp web/.env.example web/.env
   ```

3. Start services :

   ```bash
   docker compose up --build
   ```

## Services

| Service  | URL / PORT                   |
| -------- | ---------------------------- |
| Web      | http://localhost:5173        |
| API      | http://localhost:3000        |
| Postgres | localhost:5234               |

Prisma migrations are applied automatically when the API starts.

## Stop

```bash
docker compose down
```

To reset the database :

```bash
docker compose down -v
```
