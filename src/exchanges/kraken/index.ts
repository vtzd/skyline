import { TradeParams } from '@/types.js';
import { KrakenBalanceResponse, KrakenOrderData, KrakenOrderResponse } from './types.js';
import { Either, err, isErr, ok } from '@/lib/either.js';
import { krakenRequest } from './api.js';
import { KRAKEN_API_CONFIG } from '@/config.js';
import { isProd } from '@/lib/validators.js';

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


const getOrderVolume = (price: number, balance: number, isBuyOrder: boolean) => {
    const volume = isBuyOrder ? balance / price : balance
    return Math.floor(volume)
}

const createAddOrderData = async ({ action, symbol, price }: TradeParams): Promise<Either<string[], KrakenOrderData>> => {
    const isBuyOrder = action === 'buy'
    const balanceSymbol = isBuyOrder ? 'ZUSD' : symbol
    const balance = await getSymbolBalance(balanceSymbol)
    if (isErr(balance)) {
        return balance
    }

    const volume = getOrderVolume(price, balance.data, isBuyOrder)
    return ok({
        validate: !isProd(),
        ordertype: "market",
        type: action,
        volume: volume.toString(),
        pair: `${symbol}USD`
    })
}

export const createKrakenOrder = async (params: TradeParams): Promise<Either<string[], KrakenOrderResponse>> => {
    const orderData = await createAddOrderData(params)
    if (isErr(orderData)) {
        return orderData
    }

    return await krakenRequest<KrakenOrderData, KrakenOrderResponse>(
        KRAKEN_API_CONFIG.ENDPOINTS.ADD_ORDER,
        orderData.data
    )
}