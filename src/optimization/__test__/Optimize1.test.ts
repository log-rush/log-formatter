import { SGRAstNode } from '../../parsing/ast'
import { createSGREffects } from '../../parsing/__test__/testUtil'
import { Optimize1 } from '../o1'

describe('Optimize 1 Tests', () => {
    it('should remove node with empty content', () => {
        const a = new SGRAstNode(createSGREffects(), 'a')
        const b = new SGRAstNode(createSGREffects(), '')
        const c = new SGRAstNode(createSGREffects(), 'c')

        a.insertAfter(b).insertAfter(c)
        expect(a.nextNode).toBeDefined()
        expect(a.nextNode?.nextNode).toBeDefined()
        expect(a.nextNode?.nextNode?.nextNode).toBeUndefined()

        Optimize1(a)

        expect(a.nextNode).toBeDefined()
        expect(a.nextNode?.nextNode).toBeUndefined()
    })

    it('should not remove effects from deleted nodes', () => {
        const a = new SGRAstNode(createSGREffects(), 'a')
        const b = new SGRAstNode(createSGREffects({ foreground: 'abc' }), '')
        const c = new SGRAstNode(createSGREffects(), 'c')

        a.insertAfter(b).insertAfter(c)
        expect(a.nextNode).toBeDefined()
        expect(a.nextNode?.nextNode).toBeDefined()
        expect(a.nextNode?.effect.foreground).toEqual('abc')
        expect(a.nextNode?.nextNode?.nextNode).toBeUndefined()

        Optimize1(a)

        expect(a.effect.foreground).toEqual('abc')
        expect(a.nextNode).toBeDefined()
        expect(a.nextNode?.nextNode).toBeUndefined()
        expect(a.nextNode?.effect.foreground).not.toEqual('abc')
    })
})
