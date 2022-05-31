import { ReadOnlySGRAstNode } from '../parsing/ast'
import { SGREffect } from '../parsing/types'
import { SGROutputBuilder } from './interface'

export type TextAttribute = SGREffect & {
    content: string
}

export class AttributeArrayBuilder
    implements SGROutputBuilder<TextAttribute[]>
{
    build(root: ReadOnlySGRAstNode): TextAttribute[] {
        let attributes: TextAttribute[] = []
        let currentNode: ReadOnlySGRAstNode | undefined = root
        while (currentNode !== undefined) {
            attributes.push({
                ...currentNode.effect,
                content: currentNode.content,
            })
            currentNode = currentNode.nextNode
        }
        return attributes
    }
}
