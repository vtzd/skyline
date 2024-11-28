import { TradeParams, ValidationResult } from "./types.js"

// TODO move consts to config file
const VALID_SYMBOLS = ["KAS", "USD"]
const isValidSymbol = (symbol: any): boolean => {
    console.log(symbol)
    if (typeof symbol !== "string") {
        return false
    }

    return VALID_SYMBOLS.includes(symbol)
}

const VALID_EXCHANGES = ["Kraken"]
const isValidExchange = (exchange: any): boolean => {
    console.log(exchange)
    if (typeof exchange !== "string") {
        return false
    }

    return VALID_EXCHANGES.includes(exchange)
}

const VALID_ACTIONS = ["buy", "sell"]
const isValidAction = (action: any): boolean => {
    console.log(action)
    if (typeof action !== "string") {
        return false
    }

    return VALID_ACTIONS.includes(action)
}


const isValidSecret = (secret: any): boolean => {
    if (typeof secret !== "string") {
        return false
    }

    return process.env.API_SECRET === secret
}


export const validateTradeRequest = (params: unknown): ValidationResult<TradeParams> => {
    if (!params || typeof params !== 'object') {
        return { error: 'Invalid request body' };
    }

    const { symbol, exchange, action, secret } = params as Record<string, unknown>;

    if (!isValidSymbol(symbol)) {
        return { error: 'Invalid symbol' };
    }

    if (!isValidExchange(exchange)) {
        return { error: 'Invalid exchange' };
    }

    if (!isValidAction(action)) {
        return { error: 'Invalid action' };
    }

    if (!isValidSecret(secret)) {
        return { error: 'Invalid authentication' };
    }

    return {
        data: {
            symbol: symbol as string,
            exchange: exchange as string,
            action: action as string,
            secret: secret as string
        }
    };
};