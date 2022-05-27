import { EffectsMap, SGREffect } from './types'

export class CLIColorASTNode {
    readonly effect: SGREffect

    constructor(effect: SGREffect) {
        this.effect = effect
    }

    set<K extends keyof SGREffect>(
        key: K,
        value: SGREffect[K],
    ): CLIColorASTNode {
        this.effect[key] = value
        return this.clone()
    }

    clone(): CLIColorASTNode {
        return new CLIColorASTNode({
            weight: this.effect.weight,
            italic: this.effect.italic,
            underline: this.effect.underline,
            foreground: this.effect.foreground,
            foregroundMode: this.effect.foregroundMode,
            background: this.effect.background,
            backgroundMode: this.effect.backgroundMode,
            blink: this.effect.blink,
            crossedOut: this.effect.crossedOut,
            concealed: this.effect.concealed,
        })
    }

    Default(): CLIColorASTNode {
        return new CLIColorASTNode({
            weight: EffectsMap.weight.Default,
            italic: EffectsMap.italic.Default,
            underline: EffectsMap.underline.Default,
            foreground: EffectsMap.foreground.Default,
            foregroundMode: EffectsMap.foregroundMode.Default,
            background: EffectsMap.background.Default,
            backgroundMode: EffectsMap.backgroundMode.Default,
            blink: EffectsMap.blink.Default,
            crossedOut: EffectsMap.crossedOut.Default,
            concealed: EffectsMap.concealed.Default,
        })
    }
}

export class CLIColorASTTree {}
