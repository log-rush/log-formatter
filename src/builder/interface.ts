import { ReadOnlySGRAstNode } from '../parsing/ast'

export interface SGROutputBuilder<T = string> {
    build(root: ReadOnlySGRAstNode): T
}
