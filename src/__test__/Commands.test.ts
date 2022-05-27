import { CLIColorASTNode } from '../ast'
import { CommandParserMap } from '../commands'
import { EFFECTS } from '../effect'
import { BlinkEffect } from '../types'
import { createSGREffects } from './testUtil'

describe('Command Tests', () => {
    describe('Reset', () => {
        it('should append a new ast node with default settings', () => {
            const rootNode = new CLIColorASTNode(createSGREffects(), 'r')
            const newHead = CommandParserMap[EFFECTS.Reset]('', rootNode)
            expect(newHead.previousNode).toEqual(rootNode)
            expect(newHead.effect).toEqual(newHead.Default().effect)
        })

        it('should reset all effects', () => {
            const rootNode = new CLIColorASTNode(
                createSGREffects({ blink: BlinkEffect[EFFECTS.BlinkRapid] }),
                'r',
            )
            const newHead = CommandParserMap[EFFECTS.Reset]('', rootNode)
            expect(newHead.previousNode).toEqual(rootNode)
            expect(newHead.effect).toEqual(newHead.Default().effect)
        })

        it('should ignore the remaining command', () => {
            const rootNode = new CLIColorASTNode(createSGREffects(), 'r')
            const newHead = CommandParserMap[EFFECTS.Reset](';31', rootNode)
            expect(newHead.previousNode).toEqual(rootNode)
            expect(newHead.effect).toEqual(newHead.Default().effect)
        })
    })
})
