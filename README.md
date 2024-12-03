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

## Creating a trade
When creating an trade, refer to `TradeParams` to create your data object.

## Setting up TradingView alerts
Enter your server URL under "Webhook URL", and enter the following as the alert message:
```
{
    symbol: "BTC",
    exchange: "Kraken",
    action: "{{strategy.order.action}}",
    secret: "[API_SECRET from .env]",
    price: "{{close}}"
}
```


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