import { Either, err, ok } from "./either.js"
import { TradeParams } from "../types.js"

export const isProd = (): boolean => process.env.NODE_ENV === "prod"

const isValidSymbol = (symbol: any): boolean => {
    const symbolList = process.env.VALID_SYMBOLS?.split(',')
    if (!symbolList || typeof symbol !== "string") {
        return false
    }

    return symbolList.includes(symbol)
}

const isValidExchange = (exchange: any): boolean => {
    const exchangeList = process.env.VALID_EXCHANGES?.split(',')
    if (!exchangeList || typeof exchange !== "string") {
        return false
    }

    return exchangeList.includes(exchange)
}

const isValidAction = (action: any): boolean => {
    if (typeof action !== "string") {
        return false
    }

    return ["buy", "sell"].includes(action)
}


const isValidSecret = (secret: any): boolean => {
    const envSecret = process.env.API_SECRET
    if (!envSecret || typeof secret !== "string") {
        return false
    }

    return envSecret === secret
}

const isValidPrice = (price: any): boolean => {
    return !isNaN(price) && price > 0
}

const parsePrice = (price: any): number => {
    const parsedPrice = parseFloat(price)
    return parsedPrice
}


export const validateTradeRequest = (params: unknown): Either<string, TradeParams> => {
    if (!params || typeof params !== 'object') {
        return err('Invalid request body');
    }

    const { symbol, exchange, action, secret, price } = params as Record<string, unknown>;

    if (!isValidSymbol(symbol)) {
        return err('Invalid symbol');
    }

    if (!isValidExchange(exchange)) {
        return err('Invalid exchange');
    }

    if (!isValidAction(action)) {
        return err('Invalid action');
    }

    if (!isValidSecret(secret)) {
        return err('Invalid authentication');
    }

    const parsedPrice = parsePrice(price)
    if (!isValidPrice(parsedPrice)) {
        return err('Invalid price')
    }

    return ok({
        symbol: symbol as string,
        exchange: exchange as string,
        action: action as string,
        secret: secret as string,
        price: parsedPrice
    })
};