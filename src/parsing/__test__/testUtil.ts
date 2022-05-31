import {
    BlinkEffect,
    ColorEffect,
    ColorModeEffect,
    ConcealedEffect,
    CrossedOutEffect,
    ItalicEffect,
    NegativeEffect,
    TextWeightEffect,
    UnderlineEffect,
} from '../effects'
import { SGREffect } from '../types'

export const createSGREffects = ({
    weight,
    italic,
    underline,
    foregroundMode,
    foreground,
    backgroundMode,
    background,
    blink,
    inverted,
    crossedOut,
    concealed,
}: Partial<SGREffect> = {}): SGREffect => ({
    weight: weight ?? TextWeightEffect.Default,
    italic: italic ?? ItalicEffect.Default,
    underline: underline ?? UnderlineEffect.Default,
    foregroundMode: foregroundMode ?? ColorModeEffect.Default,
    foreground: foreground ?? ColorEffect.Default,
    backgroundMode: backgroundMode ?? ColorModeEffect.Default,
    background: background ?? ColorEffect.Default,
    blink: blink ?? BlinkEffect.Default,
    inverted: inverted ?? NegativeEffect.Default,
    crossedOut: crossedOut ?? CrossedOutEffect.Default,
    concealed: concealed ?? ConcealedEffect.Default,
})
