import { TradeParams } from '@/lib/types.js';
import { KrakenBalanceResponse, KrakenOrderData, KrakenOrderResponse } from './types.js';
import { Either, err, isErr, ok } from '@/lib/either.js';
import { krakenRequest } from './api.js';
import { KRAKEN_API_CONFIG } from '@/config.js';

const parseBalanceList = (data: KrakenBalanceResponse): [string, number][] => {
    return Object.entries(data)
        .map(([key, value]): [string, number] => [key, parseInt(value)])
        .filter(([_, balance]) => !isNaN(balance) && balance > 0);
}

const getSymbolBalance = async (symbol: string): Promise<Either<string[], number>> => {
    const balanceResult = await krakenRequest<{}, KrakenBalanceResponse>(
        KRAKEN_API_CONFIG.ENDPOINTS.BALANCE,
        {}
    )
    if (isErr(balanceResult)) {
        return balanceResult
    }

    const parsedList = parseBalanceList(balanceResult.data)
    const symbolBalance = parsedList.find(([sym]) => sym === symbol)
    if (!symbolBalance) {
        return err([`No ${symbol} balance!`])
    }

    return ok(symbolBalance[1])
}

const createAddOrderData = async (params: TradeParams): Promise<Either<string[], KrakenOrderData>> => {
    // TODO Validate if pair exists
    const balanceSymbol = params.action === 'buy' ? 'USDT' : params.symbol // USDT or ZUSD?
    const symbolBalance = await getSymbolBalance(balanceSymbol)
    if (isErr(symbolBalance)) {
        return symbolBalance
    }

    return ok({
        validate: true, // TODO turn off
        ordertype: "market",
        type: params.action,
        volume: symbolBalance.toString(),
        pair: `${params.symbol}USDT`
    })
}

export const createOrder = async (params: TradeParams): Promise<Either<string[], KrakenOrderResponse>> => {
    const orderData = await createAddOrderData(params)
    if (isErr(orderData)) {
        return orderData
    }

    return await krakenRequest<KrakenOrderData, KrakenOrderResponse>(
        KRAKEN_API_CONFIG.ENDPOINTS.BALANCE,
        orderData.data
    )
}