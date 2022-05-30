import { SGRAstNode } from './ast'
import { CommandParserMap } from './commands'
import { EFFECTS, TOKENS } from './effects'
import {
    DefaultSGREffects,
    EmptySGREffects,
    PropertyOf,
    SGREffect,
} from './types'

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

                let commandLength = 0
                while (data[pointer + commandLength] !== CLOSE_BYTE) {
                    commandLength++
                }

                const node = this.parseSGRCommand(
                    data.slice(pointer, pointer + commandLength),
                )
                pointer += commandLength + 1
                contentStart = pointer

                if (node) {
                    ASTHead.insertAfter(node)
                    ASTHead = node
                }
                continue
            }
            pointer++
        }

        if (pointer > contentStart) {
            const finalNode = SGRAstNode.New()
            finalNode.setContent(data.substring(contentStart, pointer))
            ASTHead.insertAfter(finalNode)
            ASTHead = finalNode
        }
        this.normalizeAst(ASTRoot)
        return ASTRoot
    }

    isSGRCommandStart(data: string, position: number) {
        const char = data[position]
        for (const openingSequence of SGRCommandOpener) {
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

    parseSGRCommand(data: string): SGRAstNode | undefined {
        const node = new SGRAstNode(EmptySGREffects, '')
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

    //! this method *only* mutates references
    normalizeAst(head: SGRAstNode): void {
        let currentNode: SGRAstNode | undefined = head
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
}
