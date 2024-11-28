import * as crypto from 'node:crypto'
import * as querystring from 'node:querystring'
import axios, { AxiosRequestConfig } from "axios"
import { TradeParams } from '@/types.js';
import { KrakenBalanceResponse, KrakenOrderResponse, KrakenRequest } from './types.js';

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
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'API-Key': key,
        'API-Sign': sign
    }
}

const getAccountBalance = async (): Promise<number> => {
    const endpoint = KRAKEN_API_CONFIG.ENDPOINTS.BALANCE
    const nonce = Date.now().toString()
    const data = { nonce }
    const config = createOrderConfig(endpoint, data)

    if (!config) {
        // TODO
        return 0
    }

    try {
        const response = await axios.request<KrakenBalanceResponse>(config)
        console.log(response)
        if (response.data.error.length > 0) {
            console.error('Kraken API error:', response.data.error)
            return 0
        }
        // TODO
        return 0
    } catch (error) {
        console.error('Failed to fetch balance:', error)
        // TODO
        return 0
    }
}

const createAddOrderData = async (params: TradeParams): Promise<KrakenRequest['data'] | undefined> => {
    return undefined
    // TODO
    // {
    //     nonce: Date.now().toString(),
    //     validate: true, // TODO
    //     ordertype: "market",
    //     type: params.action,
    //     volume: , // TODO
    //     pair: `${params.symbol}USD`
    // }
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
        data: JSON.stringify(data)
    }
}

export const createOrder = async (params: TradeParams): Promise<KrakenOrderResponse | undefined> => {
    const accountBalance = await getAccountBalance()
    // TODO
    return undefined
}