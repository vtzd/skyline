export type ApiConfig = {
    BASE_URL: string,
    ENDPOINTS: Record<string, string>,
}


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
