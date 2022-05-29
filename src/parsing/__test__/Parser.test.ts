import { SGRAstNode } from '../ast'
import { EffectKey } from '../effects'
import { SGRCommandParser } from '../parser'
import {
    ColorModeEffect,
    DefaultSGREffects,
    EmptySGREffects,
    SGREffect,
    TextWeightEffect,
} from '../types'

const expectNode = (node: SGRAstNode | undefined): node is SGRAstNode => {
    expect(node).toBeDefined()
    return node !== undefined
}

const expectNoUndefinedKey = <T extends Record<string, V>, V = unknown>(
    object: T,
    values: Partial<T> = {},
    inverse: boolean = false,
) => {
    for (const key of Object.keys(object)) {
        if (inverse) {
            expect(object[key]).toBeUndefined()
        } else {
            expect(object[key]).toBeDefined()
        }
        if (values[key]) {
            expect(object[key]).toEqual(values[key])
        }
    }
}

describe('Parser Tests', () => {
    let parser: SGRCommandParser

    beforeEach(() => {
        parser = new SGRCommandParser()
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

    describe('merge sgr effects', () => {
        it('should append new content', () => {
            const before: SGREffect = {
                ...EmptySGREffects,
                background: 'abc',
            }
            const after: SGREffect = {
                ...EmptySGREffects,
                foreground: '123',
            }
            const result = parser.mergeEffects(before, after)
            expect(result.background).toEqual(before.background)
            expect(result.foreground).toEqual(after.foreground)
        })

        it('should not override existing content with undefined', () => {
            const before: SGREffect = {
                ...EmptySGREffects,
                background: 'abc',
            }
            const after: SGREffect = {
                ...EmptySGREffects,
                foreground: '123',
                background: undefined,
            }
            const result = parser.mergeEffects(before, after)
            expect(result.background).toEqual(before.background)
            expect(result.foreground).toEqual(after.foreground)
        })

        it('should override existing content', () => {
            const before: SGREffect = {
                ...EmptySGREffects,
                background: 'abc',
            }
            const after: SGREffect = {
                ...EmptySGREffects,
                foreground: '123',
                background: 'xxx',
            }
            const result = parser.mergeEffects(before, after)
            expect(result.background).toEqual(after.background)
            expect(result.foreground).toEqual(after.foreground)
        })
    })

    it('should normalize sgr effects', () => {
        const result1 = parser.normalizeEffect(EmptySGREffects)
        expectNoUndefinedKey(result1, DefaultSGREffects)
        const result2 = parser.normalizeEffect({ foreground: 'abc' })
        expectNoUndefinedKey(result2)
        expect(result2.foreground).toEqual('abc')
    })

    describe('ast normalization', () => {
        it('should normalize ast node effects', () => {
            const node = SGRAstNode.New()
            expectNoUndefinedKey(node.effect, {}, true)
            parser.normalizeAst(node)
            expectNoUndefinedKey(node.effect, DefaultSGREffects)
        })

        it('should not override effects', () => {
            const node = new SGRAstNode(
                { ...EmptySGREffects, foreground: 'abc' },
                '',
            )
            parser.normalizeAst(node)
            expectNoUndefinedKey(node.effect)
            expect(node.effect.foreground).toEqual('abc')
        })

        it('should recurse over all nodes and incrementally apply effects', () => {
            const node1 = new SGRAstNode(
                { ...EmptySGREffects, foreground: 'abc' },
                '',
            )
            const node2 = new SGRAstNode(
                { ...EmptySGREffects, foreground: 'efg', italic: true },
                '',
            )
            const node3 = new SGRAstNode(
                { ...EmptySGREffects, concealed: true },
                '',
            )
            const head = node1
            node1.insertAfter(node2)
            node2.insertAfter(node3)

            parser.normalizeAst(head)
            expectNoUndefinedKey(node1.effect, {
                foreground: 'abc',
            })
            expectNoUndefinedKey(node2.effect, {
                foreground: 'efg',
                italic: true,
            })
            expectNoUndefinedKey(node3.effect, {
                foreground: 'efg',
                italic: true,
                concealed: true,
            })
        })
    })
})
