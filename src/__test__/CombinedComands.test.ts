import { CLIColorASTNode } from '../ast'
import { EffectKey } from '../effect'
import { Parser } from '../parse'
import { ColorModeEffect, NegativeEffect, UnderlineEffect } from '../types'

const expectNode = (
    node: CLIColorASTNode | undefined,
): node is CLIColorASTNode => {
    expect(node).toBeDefined()
    return node !== undefined
}

describe('Combined Command Parsing Tests', () => {
    let parserFunc: (command: string) => CLIColorASTNode | undefined

    beforeEach(() => {
        const parser = new Parser()
        parserFunc = parser.parseSGRCommand
    })

    it('should parse simple commands', () => {
        const node1 = parserFunc('31')
        if (expectNode(node1)) {
            expect(node1.effect.foreground).toEqual('1')
            expect(node1.effect.foregroundMode).toEqual(
                ColorModeEffect[EffectKey.ColorMode8],
            )
        }

        const node2 = parserFunc('48;5;192')
        if (expectNode(node2)) {
            expect(node2.effect.background).toEqual('192')
            expect(node2.effect.backgroundMode).toEqual(
                ColorModeEffect[EffectKey.ColorMode256],
            )
        }

        const node3 = parserFunc('4')
        if (expectNode(node3)) {
            expect(node3.effect.underline).toEqual(
                UnderlineEffect[EffectKey.Underline],
            )
        }

        const node4 = parserFunc('7')
        if (expectNode(node4)) {
            expect(node4.effect.inverted).toEqual(
                NegativeEffect[EffectKey.NegativeImage],
            )
        }
    })

    it('should parse combined simple commands', () => {
        const node = parserFunc('31;48;5;192;4;7')
        if (expectNode(node)) {
            expect(node.effect.foreground).toEqual('1')
            expect(node.effect.foregroundMode).toEqual(
                ColorModeEffect[EffectKey.ColorMode8],
            )
            expect(node.effect.background).toEqual('192')
            expect(node.effect.backgroundMode).toEqual(
                ColorModeEffect[EffectKey.ColorMode256],
            )
            expect(node.effect.underline).toEqual(
                UnderlineEffect[EffectKey.Underline],
            )
            expect(node.effect.inverted).toEqual(
                NegativeEffect[EffectKey.NegativeImage],
            )
        }
    })

    it('should catch invalid commands', () => {
        expect(() => {
            const node = parserFunc('xxx')
            expect(node).toBeUndefined()
        }).not.toThrow()
        expect(() => {
            const node = parserFunc('31;x')
            expect(node).toBeUndefined()
        }).not.toThrow()
        expect(() => {
            const node = parserFunc('512')
            expect(node).toBeUndefined()
        }).not.toThrow()
    })
})
