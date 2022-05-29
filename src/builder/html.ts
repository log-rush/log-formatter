import { ReadOnlySGRAstNode } from '../parsing/ast'
import { EffectKey } from '../parsing/effects'
import { EffectsMap } from '../parsing/index'
import { SGROutputBuilder } from './interface'

const classMap: Record<keyof typeof EffectsMap, Record<string, string>> = {
    foreground: {},
    background: {},
    backgroundMode: {},
    foregroundMode: {},
    blink: {
        [EffectKey.BlinkSlow]: 'l-bs',
        [EffectKey.BlinkRapid]: 'l-br',
    },
    concealed: {
        [EffectKey.ConcealedCharacters]: 'l-cc',
    },
    crossedOut: {
        [EffectKey.CrossedOut]: 'l-cr',
    },
    inverted: {
        [EffectKey.NegativeImage]: 'l-n',
    },
    italic: {
        [EffectKey.Italic]: 'l-i',
    },
    underline: {
        [EffectKey.DoublyUnderlined]: 'l-du',
        [EffectKey.Underline]: 'l-u',
    },
    weight: {
        [EffectKey.Bold]: 'l-b',
        [EffectKey.Faint]: 'l-f',
    },
}

export class HTMLNodeBuilder implements SGROutputBuilder {
    build(root: ReadOnlySGRAstNode): string {
        return ''
    }
}
