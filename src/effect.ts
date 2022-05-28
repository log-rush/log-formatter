export type Token = {
    token: EffectKey
    precedence: number
}

export const PRECEDENCE = {
    Low: 1,
    Medium: 2,
    High: 3,
} as const

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
        EffectKey.ColorBlack,
        EffectKey.ColorRed,
        EffectKey.ColorGreen,
        EffectKey.ColorYellow,
        EffectKey.ColorBlue,
        EffectKey.ColorMagenta,
        EffectKey.ColorCyan,
        EffectKey.ColorWhite,
        EffectKey.ColorDefault,
    ].map((token) => ({ token, precedence: PRECEDENCE.Low })),
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
    ].map((token) => ({ token, precedence: PRECEDENCE.Medium })),
    ...[
        EffectKey.Reset,
        EffectKey.ColorMode8,
        EffectKey.ColorMode256,
        EffectKey.Foreground,
        EffectKey.Background,
        EffectKey.BrightForeground,
        EffectKey.BrightBackground,
    ].map((token) => ({ token, precedence: PRECEDENCE.High })),
]

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

// \033[38;2;255;0;0;48;2;0;255;0m
