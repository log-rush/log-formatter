import { ReadOnlySGRAstNode } from '../parsing/ast'
import { SGROutputBuilder } from './interface'

export class RawTextBuilder implements SGROutputBuilder {
    build(root: ReadOnlySGRAstNode): string {
        let aggregatedContent = ''
        let currentNode: ReadOnlySGRAstNode | undefined = root
        while (currentNode !== undefined) {
            aggregatedContent += currentNode.content
            currentNode = currentNode.nextNode
        }
        return aggregatedContent
    }
}
