import { SGRCommandParser, WriteableSGRAstNode, ASTTransformer } from '../parsing'

/**
 * @internal
 */
export const Optimize1: ASTTransformer = (head: WriteableSGRAstNode) => {
    const parser = new SGRCommandParser()
    let node: WriteableSGRAstNode | undefined = head
    while (node !== undefined) {
        if (node.previousNode && node.previousNode?.content === '') {
            const removedNode = node.removeBefore()
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
