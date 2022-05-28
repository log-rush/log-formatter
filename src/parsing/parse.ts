import { SGRAstNode } from './ast'
import { CommandParserMap } from './commands'
import { EffectKey, EFFECTS, TOKENS } from './effect'
import { DefaultSGREffects, SGREffect } from './types'

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

export class SGRCommandParser {
    parse(data: string): SGRAstNode {
        let pointer = 0
        let startedSQRCommand = false
        let startIndex = undefined
        let endIndex = undefined
        let contentStart = 0
        let ASTRoot = SGRAstNode.Default()
        let ASTHead = ASTRoot

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
                    ASTHead.appendContent(data.substring(contentStart, pointer))
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
                    const node = this.parseSGRCommand(
                        data.slice(startIndex + 1, endIndex),
                    )

                    if (node) {
                        ASTHead.insertAfter(node)
                        ASTHead = node
                    }

                    contentStart = pointer + 1
                    startedSQRCommand = false
                    startIndex = undefined
                    endIndex = undefined
                }
            }
            pointer++
        }

        if (pointer > contentStart) {
            const finalNode = SGRAstNode.Default()
            finalNode.setContent(data.substring(contentStart, pointer))
            ASTHead.insertAfter(finalNode)
            ASTHead = finalNode
        }

        return ASTRoot
    }

    parseSGRCommand(data: string): SGRAstNode | undefined {
        const node = new SGRAstNode(DefaultSGREffects, '')
        let command = data

        while (command.length > 0) {
            let hasFoundToken = false

            for (let i = 0; i < TOKENS.length; i++) {
                if (command.startsWith(EFFECTS[TOKENS[i].token])) {
                    const token = TOKENS[i].token
                    const commandParser = CommandParserMap[token]

                    if (!commandParser) return undefined
                    const result = commandParser(
                        command.slice(EFFECTS[token].length),
                    )

                    if (result.matches) {
                        hasFoundToken = true
                        command = result.remainingCommand
                        for (const [key, value] of Object.entries(
                            result.alteredEffects,
                        )) {
                            node.setEffect(key as keyof SGREffect, value)
                        }
                        break
                    }
                }
            }

            if (!hasFoundToken) {
                return undefined
            }
        }
        return node
    }
}
