import { Request, Response } from 'express';
import { createOrder } from "../exchanges/kraken/index.js";
import { resolveResponse } from './response.js';
import { TradeParams } from './types.js';
import { validateTradeRequest } from './validators.js';

export const postTrade = async (req: Request<{}, {}, TradeParams>, res: Response) => {
    const validationResult = validateTradeRequest(req.body);
    if (!validationResult?.data || validationResult.error) {
        resolveResponse(res, 400, {
            status: 'error',
            message: validationResult.error,
            data: req.body
        });
        return;
    }

    try {
        const orderResult = await createOrder(validationResult.data);
        if (!orderResult) {
            resolveResponse(res, 422, {
                status: 'error',
                message: 'Order creation failed',
                data: null
            });
            return;
        }

        resolveResponse(res, 201, {
            status: 'success',
            message: 'Trade order created successfully',
            data: orderResult
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        resolveResponse(res, 500, {
            status: 'error',
            message: 'Internal server error while processing trade',
            error: errorMessage
        });
    }
};