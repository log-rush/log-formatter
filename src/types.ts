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
}

export const ItalicEffect = {
    [EFFECTS.Italic]: true,
    [EFFECTS.NotItalic]: false,
    Default: false,
}

export const UnderlineEffect = {
    [EFFECTS.NotUnderlined]: 1,
    [EFFECTS.Underline]: 2,
    [EFFECTS.DoublyUnderlined]: 3,
    Default: 1,
}

export const NegativeEffect = {
    [EFFECTS.NegativeImage]: true,
    [EFFECTS.PositiveImage]: false,
    Default: false,
}

export const ConcealedEffect = {
    [EFFECTS.ConcealedCharacters]: true,
    [EFFECTS.RevealedCharacters]: false,
    Default: false,
}

export const CrossedOutEffect = {
    [EFFECTS.CrossedOut]: true,
    [EFFECTS.NotCrossedOut]: false,
    Default: false,
}

export const BlinkEffect = {
    [EFFECTS.Steady]: 1,
    [EFFECTS.BlinkSlow]: 2,
    [EFFECTS.BlinkRapid]: 3,
    Default: 1,
}

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
}

export const EffectsMap: {
    [K in keyof SGREffect]: DefaultAble<SGREffect[K]>
} = {
    weight: TextWeightEffect,
    italic: ItalicEffect,
    underline: UnderlineEffect,
    foreground: ColorEffect,
    background: ColorEffect,
    blink: BlinkEffect,
    crossedOut: CrossedOutEffect,
    concealed: ConcealedEffect,
}

export type SGREffect = {
    // font: '' not supported
    weight: PropertyOf<typeof TextWeightEffect>
    italic: PropertyOf<typeof ItalicEffect>
    underline: PropertyOf<typeof UnderlineEffect>
    foreground: PropertyOf<typeof ColorEffect>
    background: PropertyOf<typeof ColorEffect>
    blink: PropertyOf<typeof BlinkEffect>
    crossedOut: PropertyOf<typeof CrossedOutEffect>
    concealed: PropertyOf<typeof ConcealedEffect>
}

const t = <T>(x: DefaultAble<T>) => {}
