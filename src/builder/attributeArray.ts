import {
    SGREffect,
    ColorEffect,
    ColorModeEffect,
    EffectKey,
    DefaultSGREffects,
    TextWeightEffect,
    BlinkEffect,
    UnderlineEffect,
} from '../parsing'
import { ReadOnlySGRAstNode } from '../parsing/ast'
import { SGROutputBuilder } from './interface'

export type TextAttribute = {
    weight?: 'bold' | 'faint'
    italic?: true
    underline?: 'single' | 'double'
    foreground?: string
    background?: string
    blink?: 'slow' | 'rapid'
    inverted?: true
    crossedOut?: true
    concealed?: true
    content: string
}

export class AttributeArrayBuilder implements SGROutputBuilder<TextAttribute[]> {
    private getColor(effect: SGREffect, type: 'foreground' | 'background'): string {
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

    private getWeight(effect: SGREffect): TextAttribute['weight'] {
        if (effect.weight === TextWeightEffect[EffectKey.Bold]) {
            return 'bold'
        } else if (effect.weight === TextWeightEffect[EffectKey.Faint]) {
            return 'faint'
        }
        return undefined
    }

    private getItalic(effect: SGREffect): TextAttribute['italic'] {
        return effect.italic === DefaultSGREffects.italic ? undefined : true
    }

    private getUnderline(effect: SGREffect): TextAttribute['underline'] {
        if (effect.weight === UnderlineEffect[EffectKey.Underline]) {
            return 'single'
        } else if (effect.weight === UnderlineEffect[EffectKey.DoublyUnderlined]) {
            return 'double'
        }
        return undefined
    }

    private getForeground(effect: SGREffect): TextAttribute['foreground'] {
        return effect.foreground === DefaultSGREffects.foreground ? undefined : this.getColor(effect, 'foreground')
    }

    private getBackground(effect: SGREffect): TextAttribute['background'] {
        return effect.foreground === DefaultSGREffects.foreground ? undefined : this.getColor(effect, 'background')
    }

    private getBlink(effect: SGREffect): TextAttribute['blink'] {
        if (effect.weight === BlinkEffect[EffectKey.BlinkRapid]) {
            return 'rapid'
        } else if (effect.weight === BlinkEffect[EffectKey.BlinkSlow]) {
            return 'slow'
        }
        return undefined
    }

    private getInverted(effect: SGREffect): TextAttribute['inverted'] {
        return effect.inverted === DefaultSGREffects.inverted ? undefined : true
    }

    private getCrossedOut(effect: SGREffect): TextAttribute['crossedOut'] {
        return effect.crossedOut === DefaultSGREffects.crossedOut ? undefined : true
    }

    private getConcealed(effect: SGREffect): TextAttribute['concealed'] {
        return effect.concealed === DefaultSGREffects.concealed ? undefined : true
    }

    build(root: ReadOnlySGRAstNode): TextAttribute[] {
        let attributes: TextAttribute[] = []
        let currentNode: ReadOnlySGRAstNode | undefined = root
        while (currentNode !== undefined) {
            attributes.push({
                weight: this.getWeight(currentNode.effect),
                italic: this.getItalic(currentNode.effect),
                underline: this.getUnderline(currentNode.effect),
                foreground: this.getForeground(currentNode.effect),
                background: this.getBackground(currentNode.effect),
                blink: this.getBlink(currentNode.effect),
                inverted: this.getInverted(currentNode.effect),
                crossedOut: this.getCrossedOut(currentNode.effect),
                concealed: this.getConcealed(currentNode.effect),
                content: currentNode.content,
            })
            currentNode = currentNode.nextNode
        }
        return attributes
    }
}
