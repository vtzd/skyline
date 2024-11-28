export type KrakenRequest<T = {}> = {
    headers: {
        'Content-Type': string,
        'Accept': string,
        'API-Key': string,
        'API-Sign': string
    },
    data: {
        nonce: string,
    } & T
}

type KrakenResponse<T> = {
    error: string[];
    result: T;
};

// Balance
export type KrakenBalanceRequest = KrakenRequest;

export type KrakenBalanceResponse = KrakenResponse<{
    [key: string]: string;
}>;

// Add order
export type KrakenOrderRequest = KrakenRequest<{
    pair: string;
    type: 'buy' | 'sell';
    ordertype: 'market' | 'limit';
    volume: string;
    price?: string;
    validate?: boolean;
}>

export type KrakenOrderResponse = KrakenResponse<{
    descr: { order: string };
    txid: string[];
}>;

