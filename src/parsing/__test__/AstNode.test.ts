import { SGRAstNode } from '../ast'
import { EffectKey } from '../effects'
import { BlinkEffect } from '../types'
import { createSGREffects } from './testUtil'

describe('AST Node Test', () => {
    it('should initialize with arguments', () => {
        const effects = createSGREffects()
        const node = new SGRAstNode(effects, 'abc')

        expect(node.effect).toEqual(effects)
        expect(node.content).toEqual('abc')
    })

    it('should insert node after', () => {
        const a = new SGRAstNode(createSGREffects(), 'a')
        const b = new SGRAstNode(createSGREffects(), 'b')
        const c = new SGRAstNode(createSGREffects(), 'c')

        expect(a.nextNode).toBeUndefined()
        a.insertAfter(b)
        expect(a.nextNode).toBe(b)
        expect(b.previousNode).toBe(a)

        expect(b.nextNode).toBeUndefined()
        b.insertAfter(c)
        expect(b.nextNode).toBe(c)
        expect(b.previousNode).toBe(a)
        expect(c.previousNode).toBe(b)
        expect(a.nextNode?.nextNode).toBe(c)

        const a1 = new SGRAstNode(createSGREffects(), 'a1')
        a.insertAfter(a1)
        expect(a1.previousNode).toBe(a)
        expect(a1.nextNode).toBe(b)
    })

    it('should insert node before', () => {
        const a = new SGRAstNode(createSGREffects(), 'a')
        const b = new SGRAstNode(createSGREffects(), 'b')
        const c = new SGRAstNode(createSGREffects(), 'c')

        expect(a.nextNode).toBeUndefined()
        a.insertBefore(b)
        expect(a.previousNode).toBe(b)
        expect(b.nextNode).toBe(a)

        expect(b.previousNode).toBeUndefined()
        b.insertBefore(c)
        expect(b.previousNode).toBe(c)
        expect(b.nextNode).toBe(a)
        expect(c.nextNode).toBe(b)
        expect(a.previousNode?.previousNode).toBe(c)

        const a1 = new SGRAstNode(createSGREffects(), 'a1')
        a.insertBefore(a1)
        expect(a1.nextNode).toBe(a)
        expect(a1.previousNode).toBe(b)
    })

    it('should clone deep', () => {
        const a = new SGRAstNode(createSGREffects(), 'a')
        const b = a.clone()

        a.setEffect('blink', BlinkEffect[EffectKey.BlinkRapid])
        expect(a.effect.blink).toEqual(BlinkEffect[EffectKey.BlinkRapid])
        expect(a.effect.blink).not.toEqual(b.effect.blink)

        a.content = 'xxx'
        expect(a.content).not.toEqual(b.content)
    })
})
