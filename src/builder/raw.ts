import { ReadOnlySGRAstNode } from '../parsing/ast'
import { SGROutputBuilder } from './interface'

export class RawTextBuilder implements SGROutputBuilder {
    build(root: ReadOnlySGRAstNode): string {
        return ''
    }
}
