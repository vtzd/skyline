export type Ok<T> = {
    readonly error: null,
    readonly data: T extends null | undefined ? never : T
}

export type Err<E> = {
    readonly error: E extends null | undefined ? never : E,
    readonly data: null
}

export type Either<E, T> = Err<E> | Ok<T>

export const ok = <T>(data: Ok<T>['data']): Ok<T> => ({
    error: null,
    data
})

export const err = <E>(error: Err<E>['error']): Err<E> => ({
    error,
    data: null
})

export const map = <E, T, U>(
    result: Either<E, T>,
    fn: (value: T) => U extends null | undefined ? never : U
): Either<E, U> =>
    isOk(result) ? ok(fn(result.data)) : result


export const mapErr = <E, F, T>(
    result: Either<E, T>,
    fn: (error: E) => F extends null | undefined ? never : F
): Either<F, T> =>
    isOk(result) ? result : err(fn(result.error))

export const isOk = <E, T>(result: Either<E, T>): result is Ok<T> =>
    result.error === null

export const isErr = <E, T>(result: Either<E, T>): result is Err<E> =>
    result.error !== null
