import { DefaultSGREffects, EmptySGREffects, SGREffect } from './types'

export interface ReadOnlySGRAstNode {
    readonly effect: SGREffect
    readonly content: string
    readonly nextNode: SGRAstNode | undefined
    readonly previousNode: SGRAstNode | undefined
}

export class SGRAstNode implements ReadOnlySGRAstNode {
    readonly effect: SGREffect

    public content: string

    public nextNode: SGRAstNode | undefined

    public previousNode: SGRAstNode | undefined

    constructor(
        effect: SGREffect,
        content: string,
        next?: SGRAstNode,
        previous?: SGRAstNode,
    ) {
        this.effect = { ...effect }
        this.content = content
        this.nextNode = next
        this.previousNode = previous
    }

    setEffect<K extends keyof SGREffect>(
        key: K,
        value: SGREffect[K],
    ): SGRAstNode {
        if (key in DefaultSGREffects) {
            this.effect[key] = value
        }
        return this.clone()
    }

    setEffects(effects: Partial<SGREffect>): SGRAstNode {
        for (const key of Object.keys(DefaultSGREffects)) {
            if (key in effects) {
                // @ts-ignore
                this.effect[key] = effects[key]
            }
        }
        return this.clone()
    }

    setContent(value: string): SGRAstNode {
        this.content = value
        return this.clone()
    }

    appendContent(value: string): SGRAstNode {
        this.content += value
        return this.clone()
    }

    insertBefore(node: SGRAstNode) {
        node.nextNode = this
        node.previousNode = this.previousNode
        this.previousNode = node
        return node
    }

    insertAfter(node: SGRAstNode) {
        node.previousNode = this
        node.nextNode = this.nextNode
        this.nextNode = node
        return node
    }

    clone(): SGRAstNode {
        return new SGRAstNode(
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

    static New(): SGRAstNode {
        return new SGRAstNode(EmptySGREffects, '')
    }

    New(): SGRAstNode {
        return SGRAstNode.New()
    }

    static Default(): SGRAstNode {
        return new SGRAstNode(DefaultSGREffects, '')
    }

    Default(): SGRAstNode {
        return SGRAstNode.Default()
    }
}
