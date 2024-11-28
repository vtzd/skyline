import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { postTrade } from './trade.js';
import { errorHandler, resolveResponse } from './response.js';
import { TradeParams } from './types.js';

// Initialize app
dotenv.config()
const app = express();

// Middleware
app.use(express.json());

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Routes
app.post('/api/trade', async (req: Request<{}, {}, TradeParams>, res: Response) => {
  await postTrade(req, res)
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  resolveResponse(res, 400, {
    status: 'error',
    error: 'Not Found'
  }
  )
});

// Error handlers
app.use(errorHandler);
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});