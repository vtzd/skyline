const TERMINAL_COLORS = {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    reset: '\x1b[0m'
} as const;
type TerminalColor = keyof typeof TERMINAL_COLORS;


// const writeLog = (message: string): void => {
//     // TODO
// }

export const log = {
    order: (message: string) => {
        const color = message[0] === 'b' ? 'cyan' : 'red'
        const bgColor = TERMINAL_COLORS[color];
        const reset = TERMINAL_COLORS.reset;

        console.log(`${bgColor}${message}${reset}`);

        // return {
        //     write: () => writeLog(message)
        // }
    }
}
