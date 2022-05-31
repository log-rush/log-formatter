import { SGRAstNode } from '../../parsing/ast'
import { createSGREffects } from '../../parsing/__test__/testUtil'
import { Optimize2 } from '../o2'

describe('Optimize 2 Tests', () => {
    it('should remove node with empty content', () => {
        const a = new SGRAstNode(createSGREffects(), 'a')
        const b = new SGRAstNode(createSGREffects(), 'b')
        const c = new SGRAstNode(createSGREffects({ foreground: 'abc' }), 'c')

        a.insertAfter(b).insertAfter(c)
        expect(a.nextNode).toBe(b)
        expect(a.nextNode?.nextNode).toBe(c)
        expect(a.nextNode?.nextNode?.nextNode).toBeUndefined()

        Optimize2(a)

        expect(a.nextNode).toBe(c)
        expect(c.previousNode).toBe(a)
        expect(b.nextNode).toBeUndefined()
        expect(b.previousNode).toBeUndefined()
    })

    it('should not remove content from deleted nodes', () => {
        const a = new SGRAstNode(createSGREffects(), 'a')
        const b = new SGRAstNode(createSGREffects({ foreground: 'abc' }), 'b')
        const c = new SGRAstNode(createSGREffects({ foreground: 'abc' }), 'c')

        a.insertAfter(b).insertAfter(c)
        expect(a.nextNode).toBeDefined()
        expect(a.nextNode?.nextNode).toBeDefined()
        expect(a.nextNode?.effect.foreground).toEqual('abc')
        expect(a.nextNode?.nextNode?.nextNode).toBeUndefined()

        Optimize2(a)

        expect(a.nextNode).toBeDefined()
        expect(a.nextNode?.nextNode).toBeUndefined()
        expect(a.nextNode?.content).toEqual('bc')
    })
})
