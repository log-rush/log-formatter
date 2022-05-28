import { EFFECTS } from './effect'

export type Token = {
    token: string
    precedence: number
}

export type DefaultAble<T> = {
    [key: string]: T
    Default: T
}

export type PropertyOf<T> = T[keyof T]

export const TextWeightEffect = {
    [EFFECTS.NormalColorAndWeight]: 1,
    [EFFECTS.Bold]: 2,
    [EFFECTS.Faint]: 3,
    Default: 1,
} as const

export const ItalicEffect = {
    [EFFECTS.Italic]: true,
    [EFFECTS.NotItalic]: false,
    Default: false,
} as const

export const UnderlineEffect = {
    [EFFECTS.NotUnderlined]: 1,
    [EFFECTS.Underline]: 2,
    [EFFECTS.DoublyUnderlined]: 3,
    Default: 1,
} as const

export const NegativeEffect = {
    [EFFECTS.NegativeImage]: true,
    [EFFECTS.PositiveImage]: false,
    Default: false,
} as const

export const ConcealedEffect = {
    [EFFECTS.ConcealedCharacters]: true,
    [EFFECTS.RevealedCharacters]: false,
    Default: false,
} as const

export const CrossedOutEffect = {
    [EFFECTS.CrossedOut]: true,
    [EFFECTS.NotCrossedOut]: false,
    Default: false,
} as const

export const BlinkEffect = {
    [EFFECTS.Steady]: 1,
    [EFFECTS.BlinkSlow]: 2,
    [EFFECTS.BlinkRapid]: 3,
    Default: 1,
} as const

export const ColorEffect = {
    [EFFECTS.ColorDefault]: 1,
    [EFFECTS.ColorBlack]: 2,
    [EFFECTS.ColorRed]: 3,
    [EFFECTS.ColorGreen]: 4,
    [EFFECTS.ColorYellow]: 5,
    [EFFECTS.ColorBlue]: 6,
    [EFFECTS.ColorMagenta]: 7,
    [EFFECTS.ColorCyan]: 8,
    [EFFECTS.ColorWhite]: 9,
    [EFFECTS.NormalColorAndWeight]: 1,
    Default: 1,
} as const

export const ColorModeEffect = {
    [EFFECTS.ColorMode8]: 1,
    [EFFECTS.ColorMode256]: 2,
    [EFFECTS.ColorModeRGB]: 3,
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
    // font: '' not supported
    weight: PropertyOf<typeof TextWeightEffect>
    italic: PropertyOf<typeof ItalicEffect>
    underline: PropertyOf<typeof UnderlineEffect>
    foregroundMode: PropertyOf<typeof ColorModeEffect>
    foreground: PropertyOf<typeof ColorEffect> | string
    backgroundMode: PropertyOf<typeof ColorModeEffect>
    background: PropertyOf<typeof ColorEffect> | string
    blink: PropertyOf<typeof BlinkEffect>
    inverted: PropertyOf<typeof NegativeEffect>
    crossedOut: PropertyOf<typeof CrossedOutEffect>
    concealed: PropertyOf<typeof ConcealedEffect>
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
