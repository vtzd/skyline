import { ApiConfig } from "@/types.js";

export const KRAKEN_API_CONFIG = {
    BASE_URL: 'https://api.kraken.com',
    ENDPOINTS: {
        BALANCE: '/0/private/Balance',
        ADD_ORDER: '/0/private/AddOrder'
    },
} satisfies ApiConfig

export const VALID_SYMBOLS = ["KAS", "USD"]
export const VALID_EXCHANGES = ["Kraken"]
export const VALID_ACTIONS = ["buy", "sell"]
