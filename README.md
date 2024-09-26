# SST - API

Aplicação para gestão de Saúde e seguranca do trabalho

App cliente disponível [aqui](https://github.com/silvestr3/sst-web)

## How to start
1. Install dependencies:
```bash
npm install
```
2. Start postgres service:
```bash
docker-compose up -d
```
3. Apply migrations:
```bash
npx prisma migrate deploy
```

## Testing

- Unit tests:
```bash
npm run test
```

- E2E tests:

```bash
npm run test:e2e
```
