import { WriteableSGRAstNode } from '../parsing/ast'
import { ASTTransformer } from '../parsing/types'

export const Optimize2: ASTTransformer = (head: WriteableSGRAstNode) => {
    let node: WriteableSGRAstNode | undefined = head
    while (node !== undefined) {
        if (
            node.nextNode &&
            Object.keys(node.effect).every(
                // @ts-ignore
                (key) => node.effect[key] === node.nextNode.effect[key],
            )
        ) {
            const removedNode = node.removeAfter()
            if (removedNode) {
                node.setContent(removedNode.content + node.content)
            }
        }
        node = node.nextNode
    }
}
