import { WriteableSGRAstNode } from '../parsing/ast'
import { SGRCommandParser } from '../parsing/parser'
import { ASTTransformer } from '../parsing/types'

export const Optimize1: ASTTransformer = (head: WriteableSGRAstNode) => {
    const parser = new SGRCommandParser()
    let node: WriteableSGRAstNode | undefined = head
    while (node !== undefined) {
        if (node.previousNode && node.previousNode?.content === '') {
            const removedNode = node.removeBefore()
            if (removedNode) {
                node.setEffects(
                    parser.mergeEffects(
                        removedNode.effect,
                        parser.removeDefaultsFromEffect(node.effect),
                    ),
                )
            }
        }
        node = node.nextNode
    }
}
