import { ReadOnlySGRAstNode } from '../parsing/ast'
import { EffectKey } from '../parsing/effects'
import {
    BlinkEffect,
    ColorEffect,
    ColorModeEffect,
    ConcealedEffect,
    CrossedOutEffect,
    ItalicEffect,
    NegativeEffect,
    SGREffect,
    TextWeightEffect,
    UnderlineEffect,
} from '../parsing/types'
import { EffectsMap } from '../parsing/index'
import { SGROutputBuilder } from './interface'
import { ColorMode8Colors } from '../colors/colorDefinitions8'

const classMap: Record<keyof typeof EffectsMap, Record<string, string>> = {
    foreground: {},
    background: {},
    backgroundMode: {},
    foregroundMode: {},
    blink: {
        [BlinkEffect[EffectKey.BlinkSlow]]: 'l-bs',
        [BlinkEffect[EffectKey.BlinkRapid]]: 'l-br',
    },
    concealed: {
        [ConcealedEffect[EffectKey.ConcealedCharacters]]: 'l-cc',
    },
    crossedOut: {
        [CrossedOutEffect[EffectKey.CrossedOut]]: 'l-cr',
    },
    inverted: {
        [NegativeEffect[EffectKey.NegativeImage]]: 'l-n',
    },
    italic: {
        [ItalicEffect[EffectKey.Italic]]: 'l-i',
    },
    underline: {
        [UnderlineEffect[EffectKey.DoublyUnderlined]]: 'l-du',
        [UnderlineEffect[EffectKey.Underline]]: 'l-u',
    },
    weight: {
        [TextWeightEffect[EffectKey.Bold]]: 'l-b',
        [TextWeightEffect[EffectKey.Faint]]: 'l-f',
    },
}

export class HTMLNodeBuilder implements SGROutputBuilder {
    private getColor(
        effect: SGREffect,
        type: 'foreground' | 'background',
    ): string {
        const color = effect[type]
        if (color === ColorEffect.Default) return ''
        const colorMode = effect[`${type}Mode`]
        if (!color || !colorMode) return ''
        if (colorMode === ColorModeEffect[EffectKey.ColorMode8])
            // @ts-ignore
            return ColorMode8Colors[color] ?? ''
        else if (colorMode === ColorModeEffect[EffectKey.ColorMode256])
            // @ts-ignore
            return ColorMode256Colors[color] ?? ''
        else return color as string
    }

    build(root: ReadOnlySGRAstNode): string {
        const wrapper = document.createElement('p')
        wrapper.classList.add('log')

        let currentNode: ReadOnlySGRAstNode | undefined = root
        while (currentNode !== undefined) {
            const node = document.createElement('span')
            node.innerText = currentNode.content

            for (const [key, value] of Object.entries(currentNode.effect)) {
                if (
                    EffectsMap[key as keyof SGREffect].Default !== value &&
                    value !== undefined &&
                    classMap[key as keyof SGREffect][value]
                ) {
                    node.classList.add(classMap[key as keyof SGREffect][value])
                }
            }

            const fgColor = this.getColor(currentNode.effect, 'foreground')
            const bgColor = this.getColor(currentNode.effect, 'background')
            node.setAttribute('style', `--fg: ${fgColor}; --bg: ${bgColor}`)

            wrapper.appendChild(node)
            currentNode = currentNode.nextNode
        }

        const exportWrapper = document.createElement('div')
        exportWrapper.appendChild(wrapper)
        return exportWrapper.innerHTML
    }
}
