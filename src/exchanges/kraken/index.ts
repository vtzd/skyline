import * as crypto from 'node:crypto'
import * as querystring from 'node:querystring'
import axios, { AxiosRequestConfig } from "axios"
import { TradeParams } from '@/types.js';
import { KrakenBalance, KrakenBalanceResponse, KrakenOrderRequest, KrakenOrderResponse, KrakenRequest } from './types.js';

const KRAKEN_API_CONFIG = {
    BASE_URL: 'https://api.kraken.com',
    ENDPOINTS: {
        BALANCE: '/0/private/Balance',
        ADD_ORDER: '/0/private/AddOrder'
    },
} as const;

const createSign = (endpoint: string, data: KrakenRequest['data']): string | undefined => {
    const secret = process.env.KRAKEN_SECRET
    if (!secret) {
        return undefined
    }

    const nonce = data.nonce
    const dataString = querystring.stringify(data)
    const signString = nonce + dataString

    const sha256Hash = crypto.createHash('sha256').update(signString).digest();
    const message = endpoint + sha256Hash.toString('binary');
    const secretBuffer = Buffer.from(secret, 'base64');
    const hmac = crypto.createHmac('sha512', secretBuffer);
    hmac.update(message, 'binary');

    return hmac.digest('base64');
}

const createHeaders = (endpoint: string, data: KrakenRequest['data']): KrakenRequest['headers'] | undefined => {
    const key = process.env.KRAKEN_KEY
    const sign = createSign(endpoint, data)
    if (!key || !sign) {
        return undefined
    }

    return {
        'Content-Type': 'application/x-www-form-urlencoded', // application/json
        'Accept': 'application/json',
        'API-Key': key,
        'API-Sign': sign
    }
}

const getAccountBalance = async (): Promise<KrakenBalance | undefined> => {
    const endpoint = KRAKEN_API_CONFIG.ENDPOINTS.BALANCE
    const nonce = Date.now().toString()
    const data = { nonce }
    const config = createOrderConfig(endpoint, data)

    if (!config) {
        return undefined
    }

    try {
        const response = await axios.request<KrakenBalanceResponse>(config)
        if (!response.data.result || response.data.error.length > 0) {
            console.error('Kraken API error:', response.data.error)
            return undefined
        }

        const parsedBalance = Object.fromEntries(
            Object.entries(response.data.result).map(([key, value]) =>
                [key, Math.floor(parseFloat(value))]
            )
        );
        return parsedBalance
    } catch (error) {
        console.error('Failed to fetch balance:', error)
        return undefined
    }
}

const createAddOrderData = (params: TradeParams, balance: KrakenBalance): KrakenOrderRequest['data'] | undefined => {
    const symbolBalance = balance[params.action === 'buy' ? 'USDT' : params.symbol]
    if (!symbolBalance) {
        // TODO Return error "No available balance"
        return undefined
    }

    return {
        nonce: Date.now().toString(),
        validate: true, // TODO
        ordertype: "market",
        type: params.action as 'buy' | 'sell',
        volume: symbolBalance.toString(),
        pair: `${params.symbol}USDT`
    }
}

const createOrderConfig = <T extends KrakenRequest['data']>(endpoint: string, data: T): AxiosRequestConfig | undefined => {
    const headers = createHeaders(endpoint, data)
    if (!headers) {
        return undefined
    }

    const url = `${KRAKEN_API_CONFIG.BASE_URL}${endpoint}`
    return {
        method: 'post',
        url,
        headers,
        data
    }
}

export const createOrder = async (params: TradeParams): Promise<KrakenOrderResponse | undefined> => {
    const accountBalance = await getAccountBalance()
    if (!accountBalance) {
        return undefined
    }

    const orderData = createAddOrderData(params, accountBalance)
    console.log(orderData)
    // TODO
    return undefined
}


// TODO
// Try to keep the data in 1 flow. Data object gets passed through all functions to minimize side effects
// and keep logic central. E.g. nonce won't be created in every function, but should be in header creation
// instead.