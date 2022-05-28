import { SGRAstNode } from '../ast'
import { EffectKey } from '../effect'
import { Parser } from '../parse'
import { ColorModeEffect, TextWeightEffect } from '../types'

const expectNode = (node: SGRAstNode | undefined): node is SGRAstNode => {
    expect(node).toBeDefined()
    return node !== undefined
}

describe('Parser Tests', () => {
    let parser: Parser

    beforeEach(() => {
        parser = new Parser()
    })

    it('should parse simple commands', () => {
        const ast = parser.parse('\x1b[1mHello World\x1b[0m')
        const targetNode = ast.nextNode
        expect(ast.content).toBe('')
        if (expectNode(targetNode)) {
            expect(targetNode.content).toBe('Hello World')
            expect(targetNode.effect.weight).toBe(
                TextWeightEffect[EffectKey.Bold],
            )
            if (expectNode(targetNode?.nextNode)) {
                expect(targetNode.nextNode?.nextNode).toBeUndefined()
                expect(targetNode.nextNode?.content).toBe('')
                expect(targetNode.nextNode?.effect?.weight).toBe(
                    TextWeightEffect.Default,
                )
            }
        }
    })

    it('should parse chained commands', () => {
        const ast = parser.parse('\x1b[1;32;48;2;0;0;0;3;2mHello World\x1b[0m')
        const targetNode = ast.nextNode
        expect(ast.content).toBe('')
        if (expectNode(targetNode)) {
            expect(targetNode.content).toBe('Hello World')
            expect(targetNode.effect.weight).toBe(
                TextWeightEffect[EffectKey.Faint],
            )
            expect(targetNode.effect.italic).toBe(true)
            expect(targetNode.effect.foreground).toBe('2')
            expect(targetNode.effect.foregroundMode).toBe(
                ColorModeEffect[EffectKey.ColorMode8],
            )
            expect(targetNode.effect.background).toBe('#000000')
            expect(targetNode.effect.backgroundMode).toBe(
                ColorModeEffect[EffectKey.ColorModeRGB],
            )
        }
    })

    it('should skip erroneous commands', () => {
        const ast = parser.parse('\x1b[1mHello \x1b[xm World\x1b[0m')
        const targetNode = ast.nextNode

        expect(ast.content).toBe('')
        if (expectNode(targetNode)) {
            expect(targetNode.content).toBe('Hello  World')
            expect(targetNode.nextNode?.content).toBe('')
            expect(targetNode.nextNode?.nextNode).toBeUndefined()
        }
    })

    it('should process empty commands', () => {
        const ast = parser.parse('Hello World')
        const targetNode = ast.nextNode

        expect(ast.content).toBe('')
        if (expectNode(targetNode)) {
            expect(targetNode.content).toBe('Hello World')
            expect(targetNode.nextNode).toBeUndefined()
        }
    })
})
