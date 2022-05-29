import { ReadOnlySGRAstNode } from '../parsing/ast'
import { SGROutputBuilder } from './interface'

export class HTMLNodeBuilder implements SGROutputBuilder {
    build(root: ReadOnlySGRAstNode): string {
        return ''
    }
}
