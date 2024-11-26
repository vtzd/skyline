import express, { Request, Response } from 'express'

const errorHandler = (
  err: Error,
  req: Request,
  res: Response
) => {
  console.error('Error:', err, req, res);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


// Global error handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

const VALID_SYMBOLS = ["KAS"] as const
type ValidSymbol = typeof VALID_SYMBOLS[number]
const isValidSymbol = (symbol: any): boolean => {
  if (typeof symbol !== "string") {
    return false
  }

  return VALID_SYMBOLS.includes(symbol as ValidSymbol)
}

const VALID_EXCHANGES = ["Kraken"] as const
type ValidExchange = typeof VALID_EXCHANGES[number]
const isValidExchange = (exchange: any): boolean => {
  if (typeof exchange !== "string") {
    return false
  }

  return VALID_EXCHANGES.includes(exchange as ValidExchange)
}

const VALID_ACTIONS = ["buy", "sell"] as const
type ValidAction = typeof VALID_ACTIONS[number]
const isValidAction = (action: any): boolean => {
  if (typeof action !== "string") {
    return false
  }

  return VALID_ACTIONS.includes(action as ValidAction)
}


const isValidSecret = (secret: any): boolean => {
  if (typeof secret !== "string") {
    return false
  }

  return process.env.API_SECRET === secret
}


const isValidStopLoss = (stopLoss: any): boolean => {
  return (
    typeof stopLoss !== "number" ||
    stopLoss > 100 ||
    stopLoss <= 0
  )
}

const parseStopLoss = (stopLoss: any): number | undefined => {
  return isValidStopLoss(stopLoss) ? stopLoss : undefined
}

type TradeParams = {
  symbol: ValidSymbol,
  exchange: ValidExchange,
  action: ValidAction,
  stopLoss?: number
}
const validateTradeParams = (params: { [key: string]: any }): TradeParams | null => {
  const { symbol, exchange, action, secret, stopLoss } = params
  if (
    isValidSymbol(symbol) &&
    isValidExchange(exchange) &&
    isValidAction(action) &&
    isValidSecret(secret)
  ) {
    return {
      symbol,
      exchange,
      action,
      stopLoss: parseStopLoss(stopLoss)
    }
  }

  return null
}


const createKrakenRequest = (params: TradeParams): unknown => {
  return {
    validate: true, // Validate params only TURN OFF LATER
    nonce: null, // TODO: Idk what this is lol
    ordertype: "market",
    type: params.action,
    volume: null, // TODO: Get account value. This is in BASE CURRENCY
    pair: `${params.symbol}USD`,
    "close[ordertype]": "stop-loss",
    "close[price]": null, // TODO: Calc with current price and params.stopLoss
  }
}
const createTradeRequest = (params: TradeParams): unknown => {
  // Check which exhacnge to use
  // Build body through that
  const createBody: Record<ValidExchange, (params: TradeParams) => unknown> = {
    'Kraken': createKrakenRequest
  }

  return createBody[params.exchange](params)
}

const executeTrade = (params: TradeParams) => {
  const requestBody = createTradeRequest(params)
  // post order
}

app.post('/api/trade', (req: Request, res: Response) => {

  const reqBody = req.body.json()
  const params = validateTradeParams(reqBody)

  if (!params) {
    res.status(400).json({ message: 'Invalid body', data: req.body });
    return;
  }
  res.status(201).json({ message: 'Success', data: req.body });

  executeTrade(params)

});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

