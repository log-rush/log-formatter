import { DefaultAble, SGREffect } from './types'

/**
 * @internal
 */
export type Token = {
    token: EffectKey
    precedence: number
}

/**
 * @internal
 */
export const EffectPrecedence = {
    Low: 1,
    Medium: 2,
    High: 3,
} as const

/**
 * @internal
 */
export enum EffectKey {
    Reset,
    Bold,
    Faint,
    Italic,
    Underline,
    BlinkSlow,
    BlinkRapid,
    NegativeImage,
    ConcealedCharacters,
    CrossedOut,
    DoublyUnderlined,
    NormalColorAndWeight,
    NotItalic,
    NotUnderlined,
    Steady,
    PositiveImage,
    RevealedCharacters,
    NotCrossedOut,
    ColorBlack,
    ColorRed,
    ColorGreen,
    ColorYellow,
    ColorBlue,
    ColorMagenta,
    ColorCyan,
    ColorWhite,
    ColorDefault,
    Foreground,
    Background,
    BrightForeground,
    BrightBackground,
    ColorMode8,
    ColorMode256,
    ColorModeRGB,
    ChainCommand,
}

/**
 * @internal
 */
export const EFFECTS = {
    [EffectKey.Reset]: '0',
    // Font Modifier
    [EffectKey.Bold]: '1',
    [EffectKey.Faint]: '2',
    [EffectKey.Italic]: '3',
    [EffectKey.Underline]: '4',
    [EffectKey.BlinkSlow]: '5',
    [EffectKey.BlinkRapid]: '6',
    [EffectKey.NegativeImage]: '7',
    [EffectKey.ConcealedCharacters]: '8',
    [EffectKey.CrossedOut]: '9',
    // 10 - 20: Fonts / not supported
    [EffectKey.DoublyUnderlined]: '21',
    [EffectKey.NormalColorAndWeight]: '22',
    [EffectKey.NotItalic]: '23',
    [EffectKey.NotUnderlined]: '24',
    [EffectKey.Steady]: '25',
    // 26: reserved
    [EffectKey.PositiveImage]: '27',
    [EffectKey.RevealedCharacters]: '28',
    [EffectKey.NotCrossedOut]: '29',

    // 8 Color Indicator
    [EffectKey.ColorBlack]: '0',
    [EffectKey.ColorRed]: '1',
    [EffectKey.ColorGreen]: '2',
    [EffectKey.ColorYellow]: '3',
    [EffectKey.ColorBlue]: '4',
    [EffectKey.ColorMagenta]: '5',
    [EffectKey.ColorCyan]: '6',
    [EffectKey.ColorWhite]: '7',
    // 8: reserved for extended colors
    [EffectKey.ColorDefault]: '9',

    // Prefixes
    [EffectKey.Foreground]: '3',
    [EffectKey.Background]: '4',
    [EffectKey.BrightForeground]: '9',
    [EffectKey.BrightBackground]: '10',

    // 50: reserved for canceling 26
    // 51: framed / not supported
    // 52: encircled / not supported
    // 53: overlined / not supported
    // 54: not framed, not encircled / not supported
    // 55: not overlined / not supported
    // 56-59: (reserved for future standardization) / not supported
    // 60: ideogram underline or right side line / not supported
    // 61: ideogram double underline or double line on the right side / not supported
    // 62: ideogram overline or left side line / not supported
    // 63: ideogram double overline or double line on the left side / not supported
    // 64: ideogram stress marking / not supported
    // 65: cancels the effect of the rendition aspects established by parameter values 60 to 64 / not supported

    // Suffixes
    [EffectKey.ColorMode8]: '',
    [EffectKey.ColorMode256]: '8;5;', // 38 / 48 / ...
    [EffectKey.ColorModeRGB]: '8;2;',
    [EffectKey.ChainCommand]: ';',
} as const

export const TOKENS: Token[] = [
    ...[
        EffectKey.ColorMode8,
        EffectKey.ColorMode8,
        EffectKey.ColorBlack,
        EffectKey.ColorRed,
        EffectKey.ColorGreen,
        EffectKey.ColorYellow,
        EffectKey.ColorBlue,
        EffectKey.ColorMagenta,
        EffectKey.ColorCyan,
        EffectKey.ColorWhite,
        EffectKey.ColorDefault,
    ].map(token => ({ token, precedence: EffectPrecedence.Low })),
    ...[
        EffectKey.ChainCommand,
        EffectKey.Bold,
        EffectKey.Faint,
        EffectKey.Italic,
        EffectKey.Underline,
        EffectKey.BlinkSlow,
        EffectKey.BlinkRapid,
        EffectKey.NegativeImage,
        EffectKey.ConcealedCharacters,
        EffectKey.CrossedOut,
        EffectKey.DoublyUnderlined,
        EffectKey.NormalColorAndWeight,
        EffectKey.NotItalic,
        EffectKey.NotUnderlined,
        EffectKey.Steady,
        EffectKey.PositiveImage,
        EffectKey.RevealedCharacters,
        EffectKey.NotCrossedOut,
    ].map(token => ({ token, precedence: EffectPrecedence.Medium })),
    ...[
        EffectKey.Reset,
        EffectKey.ColorMode256,
        EffectKey.Foreground,
        EffectKey.Background,
        EffectKey.BrightForeground,
        EffectKey.BrightBackground,
    ].map(token => ({ token, precedence: EffectPrecedence.High })),
].reverse()

export const Color8 = [
    EffectKey.ColorBlack,
    EffectKey.ColorRed,
    EffectKey.ColorGreen,
    EffectKey.ColorYellow,
    EffectKey.ColorBlue,
    EffectKey.ColorMagenta,
    EffectKey.ColorCyan,
    EffectKey.ColorWhite,
    EffectKey.ColorDefault,
]

export const Color256 = new Array(256).fill(0).map((_, i) => i.toString())

export const TextWeightEffect = {
    [EffectKey.NormalColorAndWeight]: 1,
    [EffectKey.Bold]: 2,
    [EffectKey.Faint]: 3,
    Default: 1,
} as const

export const ItalicEffect = {
    [EffectKey.Italic]: 1,
    [EffectKey.NotItalic]: 2,
    Default: 2,
} as const

export const UnderlineEffect = {
    [EffectKey.NotUnderlined]: 1,
    [EffectKey.Underline]: 2,
    [EffectKey.DoublyUnderlined]: 3,
    Default: 1,
} as const

export const NegativeEffect = {
    [EffectKey.NegativeImage]: 1,
    [EffectKey.PositiveImage]: 2,
    Default: 2,
} as const

export const ConcealedEffect = {
    [EffectKey.ConcealedCharacters]: 1,
    [EffectKey.RevealedCharacters]: 2,
    Default: 2,
} as const

export const CrossedOutEffect = {
    [EffectKey.CrossedOut]: 1,
    [EffectKey.NotCrossedOut]: 2,
    Default: 2,
} as const

export const BlinkEffect = {
    [EffectKey.Steady]: 1,
    [EffectKey.BlinkSlow]: 2,
    [EffectKey.BlinkRapid]: 3,
    Default: 1,
} as const

export const ColorEffect = {
    [EffectKey.ColorDefault]: '__default__',
    [EffectKey.NormalColorAndWeight]: '__default__',
    Default: '__default__',
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
