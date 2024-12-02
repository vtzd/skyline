# Skyline
A simple server to use TradingView webhook alerts to send trades to an exchange. 


> [!WARNING]
> *None of this has been tested in production.*
> *I am not responsible for any lost capital.*

## Installation
```
npm i
```
Rename/copy `.env.example` to `.env`, and fill in the values

## Setting up TradingView alerts
When creating an alert, refer to `TradeParams` to create your message:

```
{
    symbol: "BTC",
    exchange: "Kraken",
    action: "{{strategy.order.action}}",
    secret: "[API_SECRET from .env]",
    price: "{{close}}"
}
```
And enter your server URL under "Webhook URL"


## Local API testing
```
npm run dev
```
```
curl -X POST http://localhost:3000/api/trade \
-H 'Content-Type: application/json' \
-d '{"symbol":"BTC","exchange":"Kraken","action":"buy","secret":"[API_SECRET from .env]"}'
```

## Supported exchanges
- Kraken

Will I add more? Probably not.