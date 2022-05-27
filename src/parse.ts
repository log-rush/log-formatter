export const CTRL_CHARS = [
    '\x1b',
    '\\e',
    '\\x1b',
    '\\033',
    '\\u001b',
    '\\u1b',
    '\\33',
]
export const OPEN_BYTE = '['
export const CLOSE_BYTE = 'm'

export class Parser {
    parse(data: string) {
        let pointer = 0
        let startedSQRCommand = false
        let startIndex = undefined
        let endIndex = undefined

        while (pointer < data.length) {
            const char = data[pointer]
            for (const CtrlChar of CTRL_CHARS) {
                if (
                    CtrlChar.length === 1
                        ? char === CtrlChar
                        : CtrlChar ===
                          data.slice(pointer, pointer + CtrlChar.length)
                ) {
                    // begin sequence
                    startedSQRCommand = true
                    pointer += CtrlChar.length
                    startIndex = pointer
                    endIndex = undefined
                    continue
                }
            }
            if (startedSQRCommand) {
                if (
                    // end byte of sequence
                    startIndex &&
                    endIndex === undefined &&
                    char === CLOSE_BYTE
                ) {
                    endIndex = pointer
                    this.parseSGRCommand(data.slice(startIndex + 1, endIndex))
                    startIndex = undefined
                    endIndex = undefined
                    startedSQRCommand = false
                }
            }
            pointer++
        }
    }

    parseSGRCommand(data: string) {}
}
