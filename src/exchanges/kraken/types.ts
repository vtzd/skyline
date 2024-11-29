export type KrakenRequest<T> = {
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
export type KrakenRequestData<T> = KrakenRequest<T>['data']
export type KrakenResponse<T> = {
    error: string[];
    result: T;
};

// Balance
export type KrakenBalanceData = Record<string, number>
export type KrakenBalanceResponse = Record<string, string>;


// Add order
export type KrakenOrderData = {
    pair: string;
    type: string;
    ordertype: string;
    volume: string;
    price?: string;
    validate?: boolean;
}
export type KrakenOrderResponse = {
    descr: { order: string };
    txid: string[];
}

