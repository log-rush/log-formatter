import { WriteableSGRAstNode, ASTTransformer } from '../parsing'

/**
 * @internal
 */
export const Optimize2: ASTTransformer = (head: WriteableSGRAstNode) => {
    let node: WriteableSGRAstNode | undefined = head
    while (node !== undefined) {
        if (
            node.nextNode &&
            Object.keys(node.effect).every(
                // @ts-ignore
                key => node.effect[key] === node.nextNode.effect[key],
            )
        ) {
            const removedNode = node.removeAfter()
            if (removedNode) {
                node.appendContent(removedNode.content)
            }
        }
        node = node.nextNode
    }
}
