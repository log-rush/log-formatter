import { EffectsMap, SGREffect } from './types'

export class CLIColorASTNode {
    readonly effect: SGREffect

    constructor(effect: SGREffect) {
        this.effect = effect
    }

    clone(): CLIColorASTNode {
        return new CLIColorASTNode({
            weight: this.effect.weight,
            italic: this.effect.italic,
            underline: this.effect.underline,
            foreground: this.effect.foreground,
            background: this.effect.background,
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
            background: EffectsMap.background.Default,
            blink: EffectsMap.blink.Default,
            crossedOut: EffectsMap.crossedOut.Default,
            concealed: EffectsMap.concealed.Default,
        })
    }
}

export class CLIColorASTTree {}
