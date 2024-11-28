import { Request, Response } from 'express';

export const resolveResponse = (res: Response, statusCode: number, payload: unknown): void => {
    if (!res || typeof res.status !== 'function') {
        throw new Error('Invalid response object');
    }

    res
        .status(statusCode)
        .type('application/json')
        .send(payload);
};

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response
) => {
    console.error('Error:', err);
    resolveResponse(res, 500, {
        status: 'error',
        message: 'Internal server error while processing trade',
        error: err instanceof Error ? err.message : 'Unknown error',
        data: req
    })
};