import { SGRAstNode } from '../parsing/ast'
import { SGROutputBuilder } from './interface'

export class RawTextBuilder implements SGROutputBuilder {
    build(root: SGRAstNode): string {
        return ''
    }
}
