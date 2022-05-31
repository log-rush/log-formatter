import { WriteableSGRAstNode } from './ast'
import {
    BlinkEffect,
    ColorEffect,
    ColorModeEffect,
    ConcealedEffect,
    CrossedOutEffect,
    EffectsMap,
    ItalicEffect,
    NegativeEffect,
    TextWeightEffect,
    UnderlineEffect,
} from './effects'

/**
 * @internal
 */
export type DefaultAble<T> = {
    [key: string]: T
    Default: T
}

/**
 * @internal
 */
export type PropertyOf<T> = T[keyof T]

export type SGREffect = {
    // font: '' / not supported
    weight: PropertyOf<typeof TextWeightEffect> | undefined
    italic: PropertyOf<typeof ItalicEffect> | undefined
    underline: PropertyOf<typeof UnderlineEffect> | undefined
    foregroundMode: PropertyOf<typeof ColorModeEffect> | undefined
    foreground: PropertyOf<typeof ColorEffect> | string | undefined
    backgroundMode: PropertyOf<typeof ColorModeEffect> | undefined
    background: PropertyOf<typeof ColorEffect> | string | undefined
    blink: PropertyOf<typeof BlinkEffect> | undefined
    inverted: PropertyOf<typeof NegativeEffect> | undefined
    crossedOut: PropertyOf<typeof CrossedOutEffect> | undefined
    concealed: PropertyOf<typeof ConcealedEffect> | undefined
}

export const EmptySGREffects: SGREffect = {
    weight: undefined,
    italic: undefined,
    underline: undefined,
    foreground: undefined,
    foregroundMode: undefined,
    background: undefined,
    backgroundMode: undefined,
    blink: undefined,
    inverted: undefined,
    crossedOut: undefined,
    concealed: undefined,
}

export const DefaultSGREffects: SGREffect = {
    weight: EffectsMap.weight.Default,
    italic: EffectsMap.italic.Default,
    underline: EffectsMap.underline.Default,
    foreground: EffectsMap.foreground.Default,
    foregroundMode: EffectsMap.foregroundMode.Default,
    background: EffectsMap.background.Default,
    backgroundMode: EffectsMap.backgroundMode.Default,
    blink: EffectsMap.blink.Default,
    inverted: EffectsMap.inverted.Default,
    crossedOut: EffectsMap.crossedOut.Default,
    concealed: EffectsMap.concealed.Default,
}

/**
 * @internal
 */
export type ASTTransformer = (head: WriteableSGRAstNode) => void
