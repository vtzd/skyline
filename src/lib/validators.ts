import { VALID_ACTIONS, VALID_EXCHANGES, VALID_SYMBOLS } from "@/config.js"
import { Either, err, ok } from "./either.js"
import { TradeParams } from "../types.js"

const isValidSymbol = (symbol: any): boolean => {
    if (typeof symbol !== "string") {
        return false
    }

    return VALID_SYMBOLS.includes(symbol)
}

const isValidExchange = (exchange: any): boolean => {
    if (typeof exchange !== "string") {
        return false
    }

    return VALID_EXCHANGES.includes(exchange)
}

const isValidAction = (action: any): boolean => {
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