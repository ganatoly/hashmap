# HashMap

## Description

HashMap microservice using NestJS and PostgeSQL

### OpenAPI documentation

[Online json: http://localhost:4500/swagger-json](http://localhost:4500/swagger-json)

[WebUI: http://localhost:4500/swagger](http://localhost:4500/swagger)

### Healthcheck

[http://localhost:4500/health](http://localhost:4500/health)

### Monitoring (prometheus)

Prom expressions:

- hm_request_count (counter)
- hm_response_ellapsed_time (histogram)

[App metrics endpoint: http://localhost:4500/metrics](http://localhost:4500/metrics)

[Prometheus UI: http://localhost:9090](http://localhost:9090)

## Installation and Local launch

```bash
# create `.env` with the environment variables listed below
# or copy from sample:
$ cp .env.sample .env

# install deps
$ npm install

# run service only
$ npm run start

# or run docker compose with DB and prometheus
$ npm run docker:dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# Docker compose development mode
$ npm run docker:dev

# Docker compose production mode
$ npm run docker:prod
```

## Environment variables

| Name                | Description                                  |
| ------------------- | -------------------------------------------- |
| `POSTGRES_HOST`     | pg database host (not use in docker compose) |
| `POSTGRES_PORT`     | pg database port (defaults to 5432)          |
| `POSTGRES_USER`     | pg database user                             |
| `POSTGRES_PASSWORD` | pg database password                         |
| `POSTGRES_DB`       | pg database name                             |

Also, please, consider looking at `.env.sample`.
