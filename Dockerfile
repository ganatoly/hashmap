FROM node:19-buster as builder
WORKDIR /app

COPY package* ./
RUN npm install
COPY src/ ./src
COPY ["tsconfig.*", "./"]
COPY ["nest-cli.json", "./"]
RUN npm run build


FROM node:19-buster as prod
ENV NODE_ENV=production
WORKDIR /app

COPY ["package*", "./"]
RUN npm install --omit=dev

COPY --from=builder ./app/dist ./dist

COPY [".env", ".env"]

CMD npm run start:prod