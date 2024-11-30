import { Either, err, isErr, Ok, ok } from '@/lib/either.js';
import axios from "axios";
import * as crypto from 'node:crypto';
import * as querystring from 'node:querystring';
import { KrakenRequest, KrakenRequestData, KrakenResponse } from './types.js';
import { KRAKEN_API_CONFIG } from '../../config.js';

const getKey = () => {
    const key = process.env.KRAKEN_KEY
    if (!key) {
        throw new Error('KRAKEN_KEY not found!');
    }
    return key
}

const createSign = <T>(endpoint: string, data: KrakenRequestData<T>): Either<string[], string> => {
    const secret = process.env.KRAKEN_SECRET
    if (!secret) {
        return err(['KRAKEN_SECRET not found!']);
    }

    const dataString = querystring.stringify(data)
    const signString = data.nonce + dataString

    const sha256Hash = crypto.createHash('sha256').update(signString).digest();
    const message = endpoint + sha256Hash.toString('binary');
    const secretBuffer = Buffer.from(secret, 'base64');
    const hmac = crypto.createHmac('sha512', secretBuffer);
    hmac.update(message, 'binary');

    const sign = hmac.digest('base64');
    return ok(sign)
}

const addNonce = <T>(data: T): Either<string[], KrakenRequestData<T>> => {
    if (typeof data !== "object") {
        return err(['Data is not an object'])
    }
    const nonce = Date.now().toString()
    const requestData = Object.assign({ nonce }, data)

    return ok(requestData)
}

const createHeaders = <T>(endpoint: string, data: KrakenRequestData<T>): Either<string[], KrakenRequest<T>['headers']> => {
    const key = getKey();
    const sign = createSign(endpoint, data)
    if (isErr(sign)) {
        return sign
    }

    return ok({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'API-Key': key,
        'API-Sign': sign.data
    })
}

export const krakenRequest = async <T, R extends NonNullable<unknown>>(endpoint: string, data: Ok<T>['data']): Promise<Either<
    KrakenResponse<R>['error'],
    KrakenResponse<R>['result']>
> => {
    const url = `${KRAKEN_API_CONFIG.BASE_URL}${endpoint}`
    const requestData = addNonce(data)
    if (isErr(requestData)) {
        return requestData
    }

    const headers = createHeaders(endpoint, requestData.data)
    if (isErr(headers)) {
        return headers
    }

    const config = {
        method: 'post',
        url,
        headers: headers.data,
        data: requestData.data
    }

    try {
        const response = await axios.request<KrakenResponse<R>>(config)
        const { result, error } = response.data
        if (error.length > 0) {
            return err(error)
        }

        return ok(result)
    } catch (error) {
        return err(['Unknown request error'])
    }
}