import { WriteableSGRAstNode } from '../parsing/ast'
import { SGRCommandParser } from '../parsing/parser'
import { ASTTransformer } from '../parsing/types'

export const Optimize1: ASTTransformer = (head: WriteableSGRAstNode) => {
    const parser = new SGRCommandParser()
    let node: WriteableSGRAstNode | undefined = head
    while (node !== undefined) {
        if (node.nextNode && node.nextNode?.content === '') {
            const removedNode = node.removeAfter()
            if (removedNode) {
                node.setEffects(
                    parser.normalizeEffect(
                        parser.mergeEffects(
                            parser.removeDefaultsFromEffect(removedNode.effect),
                            parser.removeDefaultsFromEffect(node.effect),
                        ),
                    ),
                )
            }
        }
        node = node.nextNode
    }
}
