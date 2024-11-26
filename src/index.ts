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

const VALID_SYMBOLS: string[] = ["KAS"]
const isValidSymbol = (symbol: any): boolean => {
  if (typeof symbol !== "string") {
    return false
  }

  return VALID_SYMBOLS.includes(symbol)
}



const VALID_ACTIONS: string[] = ["buy", "sell"]
const isValidAction = (action: any): boolean => {
  if (typeof action !== "string") {
    return false
  }

  return VALID_ACTIONS.includes(action)
}


const isValidSecret = (secret: any): boolean => {
  if (typeof secret !== "string") {
    return false
  }

  return process.env.API_SECRET === secret
}

type TradeParams = {
  symbol: string,
  action: string,
  secret: string
}
const validateTradeParams = (params: { [key: string]: any }): Omit<TradeParams, "secret"> | null => {
  const { symbol, action, secret } = params
  if (
    isValidSymbol(symbol) &&
    isValidAction(action) &&
    isValidSecret(secret)
  ) {
    return { symbol, action }
  }

  return null
}

app.post('/api/trade', (req: Request, res: Response) => {

  const reqBody = req.body.json()
  const params = validateTradeParams(reqBody)
  if (!params) {
    res.status(400).json({ message: 'Invalid body', data: req.body });
    return;
  }

  res.status(201).json({ message: 'Success', data: req.body });

});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

