import { DefaultSGREffects, EffectsMap, SGREffect } from './types'

export class CLIColorASTNode {
    readonly effect: SGREffect

    public content: string

    public nextNode: CLIColorASTNode | undefined

    public previousNode: CLIColorASTNode | undefined

    constructor(
        effect: SGREffect,
        content: string,
        next?: CLIColorASTNode,
        previous?: CLIColorASTNode,
    ) {
        this.effect = { ...effect }
        this.content = content
        this.nextNode = next
        this.previousNode = previous
    }

    setEffect<K extends keyof SGREffect>(
        key: K,
        value: SGREffect[K],
    ): CLIColorASTNode {
        this.effect[key] = value
        return this.clone()
    }

    setContent(value: string): CLIColorASTNode {
        this.content = value
        return this.clone()
    }

    appendContent(value: string): CLIColorASTNode {
        this.content += value
        return this.clone()
    }

    insertBefore(node: CLIColorASTNode) {
        node.nextNode = this
        node.previousNode = this.previousNode
        this.previousNode = node
        return node
    }

    insertAfter(node: CLIColorASTNode) {
        node.previousNode = this
        node.nextNode = this.nextNode
        this.nextNode = node
        return node
    }

    clone(): CLIColorASTNode {
        return new CLIColorASTNode(
            {
                weight: this.effect.weight,
                italic: this.effect.italic,
                underline: this.effect.underline,
                foreground: this.effect.foreground,
                foregroundMode: this.effect.foregroundMode,
                background: this.effect.background,
                backgroundMode: this.effect.backgroundMode,
                blink: this.effect.blink,
                inverted: this.effect.inverted,
                crossedOut: this.effect.crossedOut,
                concealed: this.effect.concealed,
            },
            this.content,
        )
    }

    static Default(): CLIColorASTNode {
        return new CLIColorASTNode(DefaultSGREffects, '')
    }

    Default(): CLIColorASTNode {
        return CLIColorASTNode.Default()
    }
}
