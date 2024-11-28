# Skyline
## Installation
```
npm i
```
Rename/copy `.env.example` to `.env`, and fill in the values

## Local API testing:
```
npm run dev
```
```
curl -X POST http://localhost:3000/api/trade \
-H 'Content-Type: application/json' \
-d '{"symbol":"BTC","exchange":"Kraken","action":"buy","secret":"[API_SECRET from .env]"}'
```
