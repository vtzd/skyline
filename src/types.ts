export type ApiResult<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

export interface TradeParams {
    symbol: string;
    exchange: string;
    action: string;
    secret: string;
}

export interface ValidationResult<T> {
    error?: string;
    data?: T;
}

