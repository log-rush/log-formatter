import { ReadOnlySGRAstNode } from '../parsing/ast'

export interface SGROutputBuilder {
    build(root: ReadOnlySGRAstNode): string
}
