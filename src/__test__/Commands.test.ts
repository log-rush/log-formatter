import { CLIColorASTNode } from '../ast'
import {
    CommandParserMap,
    CommandResult,
    SuccessCommandResult,
} from '../commands'
import { EFFECTS } from '../effect'
import { BlinkEffect, DefaultSGREffects } from '../types'
import { createSGREffects } from './testUtil'

const expectMatch = (result: CommandResult): result is SuccessCommandResult => {
    expect(result.matches).toBeTruthy()
    return result.matches
}
const expectKey = <T extends Record<string, V>, V = unknown>(
    object: T,
    key: keyof T | string,
    value?: T[keyof T] | V,
) => {
    expect(object[key]).toBeDefined()
    if (value) {
        expect(object[key]).toEqual(value)
    }
}

describe('Command Tests', () => {
    describe('Reset', () => {
        it('should reset all effects', () => {
            const result = CommandParserMap[EFFECTS.Reset]('')
            if (expectMatch(result)) {
                for (const [key, value] of Object.entries(DefaultSGREffects)) {
                    expectKey(result.alteredEffects, key, value)
                }
            }
        })

        it('should should match', () => {
            const result = CommandParserMap[EFFECTS.Reset]('')
            expectMatch(result)
        })

        it('should return remaining command', () => {
            const result = CommandParserMap[EFFECTS.Reset]('xxx')
            if (expectMatch(result)) {
                expect(result.remainingCommand).toBe('xxx')
            }
        })
    })
})
