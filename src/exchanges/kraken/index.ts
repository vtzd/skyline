import * as crypto from 'node:crypto'
import * as querystring from 'node:querystring'
import axios from "axios"
import { TradeParams } from '@/types.js';
import { KrakenBalanceResponse, KrakenOrderData, KrakenOrderResponse, KrakenRequest, KrakenRequestData, KrakenResponse } from './types.js';

const KRAKEN_API_CONFIG = {
    BASE_URL: 'https://api.kraken.com',
    ENDPOINTS: {
        BALANCE: '/0/private/Balance',
        ADD_ORDER: '/0/private/AddOrder'
    },
} as const;

const getKey = () => {
    const key = process.env.KRAKEN_KEY
    if (!key) {
        throw new Error('KRAKEN_KEY not found!');
    }
    return key
}

const createSign = <T>(endpoint: string, data: KrakenRequestData<T>): string => {
    const secret = process.env.KRAKEN_SECRET
    if (!secret) {
        throw new Error('KRAKEN_SECRET not found!');
    }

    const dataString = querystring.stringify(data)
    const signString = data.nonce + dataString

    const sha256Hash = crypto.createHash('sha256').update(signString).digest();
    const message = endpoint + sha256Hash.toString('binary');
    const secretBuffer = Buffer.from(secret, 'base64');
    const hmac = crypto.createHmac('sha512', secretBuffer);
    hmac.update(message, 'binary');

    const sign = hmac.digest('base64');
    return sign
}

const addNonce = <T>(data: T): KrakenRequestData<T> => {
    const nonce = Date.now().toString()
    const requestData = Object.assign({ nonce }, data)

    return requestData
}

const createHeaders = <T>(endpoint: string, data: KrakenRequestData<T>): KrakenRequest<T>['headers'] => {
    const key = getKey();
    const sign = createSign(endpoint, data)

    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'API-Key': key,
        'API-Sign': sign
    }
}

const krakenRequest = async <R>(endpoint: string, data = {}): Promise<KrakenResponse<R>['result']> => {
    const requestData = addNonce(data)
    const headers = createHeaders(endpoint, requestData)
    const url = `${KRAKEN_API_CONFIG.BASE_URL}${endpoint}`
    const config = {
        method: 'post',
        url,
        headers,
        data: requestData
    }

    const response = await axios.request<KrakenResponse<R>>(config)
    const { result, error } = response.data
    if (error.length > 0) {
        throw new Error('Kraken API error:', { cause: error })
    }

    return result
}

const parseBalanceList = (data: KrakenBalanceResponse): [string, number][] => {
    return Object.entries(data)
        .map(([key, value]): [string, number] => [key, parseInt(value)])
        .filter(([_, balance]) => !isNaN(balance) && balance > 0);
}

const getSymbolBalance = async (symbol: string): Promise<number | undefined> => {
    try {
        const data = await krakenRequest<KrakenBalanceResponse>(KRAKEN_API_CONFIG.ENDPOINTS.BALANCE)

        const parsedList = parseBalanceList(data)
        const symbolBalance = parsedList.find(([sym]) => sym === symbol)
        if (!symbolBalance) {
            console.error(`No ${symbol} balance!`)
            return undefined
        }

        const [_symbol, balance] = symbolBalance
        return balance
    } catch (error) {
        console.error('Failed to fetch balance:', error)
        return undefined
    }
}

const createAddOrderData = async (params: TradeParams): Promise<KrakenOrderData | undefined> => {
    // TODO Validate if pair exists
    const balanceSymbol = params.action === 'buy' ? 'USDT' : params.symbol // USDT or ZUSD?
    const symbolBalance = await getSymbolBalance(balanceSymbol)
    if (!symbolBalance) {
        return undefined
    }

    return {
        validate: true, // TODO turn off
        ordertype: "market",
        type: params.action,
        volume: symbolBalance.toString(),
        pair: `${params.symbol}USDT`
    }
}

export const createOrder = async (params: TradeParams): Promise<KrakenOrderResponse | undefined> => {
    try {
        const orderData = await createAddOrderData(params)
        const responseData = await krakenRequest<KrakenOrderResponse>(KRAKEN_API_CONFIG.ENDPOINTS.BALANCE, orderData)
        return responseData
    } catch (error) {
        console.error('Failed to create order:', error)
        return undefined
    }
}

/**
 * TODO
 * - Test createOrder
 * - Clean up files
 * - Either Left/Right for error handling
 * - Logger
 */