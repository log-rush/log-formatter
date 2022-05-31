import { SGRAstNode, WriteableSGRAstNode } from './ast'
import { CommandParserMap } from './commands'
import { EffectKey, EFFECTS, TOKENS } from './effects'
import { DefaultSGREffects, EmptySGREffects, SGREffect } from './types'

export const CTRL_CHARS = [
    '\x1b',
    '\\e',
    '\\x1b',
    '\\033',
    '\\u001b',
    '\\u1b',
    '\\33',
] as const
export const OPEN_BYTE = '['
export const CLOSE_BYTE = 'm'
const SGRCommandOpener = CTRL_CHARS.map((ctrl) => `${ctrl}${OPEN_BYTE}`)

export class SGRCommandParser {
    parse(data: string): SGRAstNode {
        let pointer = 0
        let contentStart = 0
        let ASTRoot = SGRAstNode.Default()
        let ASTHead = ASTRoot

        while (pointer < data.length) {
            const isStart = this.isSGRCommandStart(data, pointer)
            if (isStart.isValid) {
                ASTHead.appendContent(data.substring(contentStart, pointer)) // store old content
                pointer += isStart.commandOffset // move pointer after start byte
                // search for closing byte
                let commandLength = data.substring(pointer).indexOf(CLOSE_BYTE)
                if (commandLength < 0) {
                    break
                }

                // parse command content (between opening sequence and closing byte)
                const node = this.parseSGRCommand(
                    data.slice(pointer, pointer + commandLength),
                )

                // update current index + new content start
                pointer += commandLength + 1
                contentStart = pointer

                // insert new node
                ASTHead = ASTHead.insertAfter(node)
                continue
            }
            pointer++
        }

        if (pointer > contentStart) {
            const finalNode = SGRAstNode.New()
            finalNode.setContent(data.substring(contentStart, pointer))
            ASTHead = ASTHead.insertAfter(finalNode)
        }

        this.normalizeAst(ASTRoot)
        return ASTRoot
    }

    private isSGRCommandStart(data: string, position: number) {
        const char = data[position]
        for (const openingSequence of SGRCommandOpener) {
            // search for variants of the escape character followed by an opening byte
            if (
                openingSequence.length === 1
                    ? char === openingSequence
                    : openingSequence ===
                      data.slice(position, position + openingSequence.length)
            ) {
                return {
                    isValid: true,
                    commandOffset: openingSequence.length,
                }
            }
        }
        return {
            isValid: false,
            commandOffset: 0,
        }
    }

    parseSGRCommand(data: string): SGRAstNode {
        const node = new SGRAstNode(EmptySGREffects, '')
        let command = data

        // iterate incrementally over the command
        while (command.length > 0) {
            let hasFoundToken = false

            for (let i = 0; i < TOKENS.length; i++) {
                // search for a token, that matches the current command
                if (command.startsWith(EFFECTS[TOKENS[i].token])) {
                    const token = TOKENS[i].token
                    // find a command parser for that matching token
                    const commandParser = CommandParserMap[token]
                    if (!commandParser) break

                    // execute the command
                    const result = commandParser(
                        command.slice(EFFECTS[token].length),
                    )

                    // apply result, if command was successful
                    if (result.matches) {
                        hasFoundToken = true
                        command = result.remainingCommand
                        node.setEffects({ ...result.alteredEffects })
                        break
                    }
                }
            }

            // it did not find a matching token or no token could successfully parse
            if (!hasFoundToken) {
                // check if there might be some valid commands remaining
                const index = command.indexOf(EFFECTS[EffectKey.ChainCommand])
                if (index >= 0) {
                    // try again with probably still parsable content
                    command = command.substring(
                        index + EFFECTS[EffectKey.ChainCommand].length,
                    )
                } else {
                    break
                }
            }
        }
        return node
    }

    /**
     * ! this method *only* mutates references
     * @internal
     */
    normalizeAst(head: WriteableSGRAstNode): void {
        let currentNode: WriteableSGRAstNode | undefined = head
        let previousEffects = EmptySGREffects

        while (currentNode !== undefined) {
            const newEffects = this.mergeEffects(
                previousEffects,
                currentNode.effect,
            )
            const normalizedEffects = this.normalizeEffect(newEffects)
            currentNode.setEffects(normalizedEffects)
            previousEffects = normalizedEffects
            currentNode = currentNode.nextNode
        }
    }

    /**
     * @internal
     */
    mergeEffects(
        before: SGREffect | Partial<SGREffect>,
        after: SGREffect | Partial<SGREffect>,
    ): SGREffect {
        const effects: SGREffect = {
            ...EmptySGREffects,
            ...before,
        }
        for (const [key, value] of Object.entries(after)) {
            if (value !== undefined) {
                // @ts-ignore
                effects[key] = value
            }
        }
        return effects
    }

    /**
     * @internal
     */
    normalizeEffect(effect: SGREffect | Partial<SGREffect>): SGREffect {
        const base = { ...DefaultSGREffects }
        for (const [key, value] of Object.entries(effect)) {
            if (value !== undefined) {
                // @ts-ignore
                base[key] = value
            }
        }
        return base
    }

    /**
     * @internal
     */
    removeDefaultsFromEffect(
        effect: SGREffect | Partial<SGREffect>,
    ): SGREffect {
        const base = { ...EmptySGREffects }
        for (const [key, value] of Object.entries(effect)) {
            // @ts-ignore
            if (value !== undefined && value !== DefaultSGREffects[key]) {
                // @ts-ignore
                base[key] = value
            }
        }
        return base
    }
}
