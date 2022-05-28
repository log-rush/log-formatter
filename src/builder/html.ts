import { SGRAstNode } from '../parsing/ast'
import { SGROutputBuilder } from './interface'

export class HTMLNodeBuilder implements SGROutputBuilder {
    build(root: SGRAstNode): string {
        return ''
    }
}
