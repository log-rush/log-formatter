import { EffectKey } from './effects'

export type DefaultAble<T> = {
    [key: string]: T
    Default: T
}

export type PropertyOf<T> = T[keyof T]

export const TextWeightEffect = {
    [EffectKey.NormalColorAndWeight]: 1,
    [EffectKey.Bold]: 2,
    [EffectKey.Faint]: 3,
    Default: 1,
} as const

export const ItalicEffect = {
    [EffectKey.Italic]: true,
    [EffectKey.NotItalic]: false,
    Default: false,
} as const

export const UnderlineEffect = {
    [EffectKey.NotUnderlined]: 1,
    [EffectKey.Underline]: 2,
    [EffectKey.DoublyUnderlined]: 3,
    Default: 1,
} as const

export const NegativeEffect = {
    [EffectKey.NegativeImage]: true,
    [EffectKey.PositiveImage]: false,
    Default: false,
} as const

export const ConcealedEffect = {
    [EffectKey.ConcealedCharacters]: true,
    [EffectKey.RevealedCharacters]: false,
    Default: false,
} as const

export const CrossedOutEffect = {
    [EffectKey.CrossedOut]: true,
    [EffectKey.NotCrossedOut]: false,
    Default: false,
} as const

export const BlinkEffect = {
    [EffectKey.Steady]: 1,
    [EffectKey.BlinkSlow]: 2,
    [EffectKey.BlinkRapid]: 3,
    Default: 1,
} as const

export const ColorEffect = {
    [EffectKey.ColorDefault]: 1,
    [EffectKey.ColorBlack]: 2,
    [EffectKey.ColorRed]: 3,
    [EffectKey.ColorGreen]: 4,
    [EffectKey.ColorYellow]: 5,
    [EffectKey.ColorBlue]: 6,
    [EffectKey.ColorMagenta]: 7,
    [EffectKey.ColorCyan]: 8,
    [EffectKey.ColorWhite]: 9,
    [EffectKey.NormalColorAndWeight]: 1,
    Default: 1,
} as const

export const ColorModeEffect = {
    [EffectKey.ColorMode8]: 1,
    [EffectKey.ColorMode256]: 2,
    [EffectKey.ColorModeRGB]: 3,
    Default: 1,
} as const

export const EffectsMap: {
    [K in keyof SGREffect]: DefaultAble<SGREffect[K]>
} = {
    weight: TextWeightEffect,
    italic: ItalicEffect,
    underline: UnderlineEffect,
    foregroundMode: ColorModeEffect,
    foreground: ColorEffect,
    backgroundMode: ColorModeEffect,
    background: ColorEffect,
    blink: BlinkEffect,
    inverted: NegativeEffect,
    crossedOut: CrossedOutEffect,
    concealed: ConcealedEffect,
} as const

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
