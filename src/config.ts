import { ApiConfig } from "@/types.js";

export const KRAKEN_API_CONFIG = {
    BASE_URL: 'https://api.kraken.com',
    ENDPOINTS: {
        BALANCE: '/0/private/Balance',
        ADD_ORDER: '/0/private/AddOrder'
    },
} satisfies ApiConfig