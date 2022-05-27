import { Token } from './types'

export const PRECEDENCE = {
    Low: 1,
    Medium: 2,
    High: 3,
} as const

export const EFFECTS = {
    Reset: '0',
    // Font Modifier
    Bold: '1',
    Faint: '2',
    Italic: '3',
    Underline: '4',
    BlinkSlow: '5',
    BlinkRapid: '6',
    NegativeImage: '7',
    ConcealedCharacters: '8',
    CrossedOut: '9',
    // 10 - 20: Fonts / not supported
    DoublyUnderlined: '21',
    NormalColorAndWeight: '22',
    NotItalic: '23',
    NotUnderlined: '24',
    Steady: '25',
    // 26: reserved
    PositiveImage: '27',
    RevealedCharacters: '28',
    NotCrossedOut: '29',

    // 8-Bit Color Indicator
    ColorBlack: '0',
    ColorRed: '1',
    ColorGreen: '2',
    ColorYellow: '3',
    ColorBlue: '4',
    ColorMagenta: '5',
    ColorCyan: '6',
    ColorWhite: '7',
    // 8: reserved for extended colors
    ColorDefault: '9',

    // Prefixes
    Foreground: '3',
    Background: '4',
    BrightForeground: '9',
    BrightBackground: '10',

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
    ColorMode8: '',
    ColorMode256: '8;5;', // 38 / 48 / ...
    ColorModeRGB: '8;2;',
    ChainCommand: ';',
} as const

export const TOKENS: Token[] = [
    ...[
        EFFECTS.ColorMode8,
        EFFECTS.ColorBlack,
        EFFECTS.ColorRed,
        EFFECTS.ColorGreen,
        EFFECTS.ColorYellow,
        EFFECTS.ColorBlue,
        EFFECTS.ColorMagenta,
        EFFECTS.ColorCyan,
        EFFECTS.ColorWhite,
        EFFECTS.ColorDefault,
    ].map((token) => ({ token, precedence: PRECEDENCE.Low })),
    ...[
        EFFECTS.ChainCommand,
        EFFECTS.Bold,
        EFFECTS.Faint,
        EFFECTS.Italic,
        EFFECTS.Underline,
        EFFECTS.BlinkSlow,
        EFFECTS.BlinkRapid,
        EFFECTS.NegativeImage,
        EFFECTS.ConcealedCharacters,
        EFFECTS.CrossedOut,
        EFFECTS.DoublyUnderlined,
        EFFECTS.NormalColorAndWeight,
        EFFECTS.NotItalic,
        EFFECTS.NotUnderlined,
        EFFECTS.Steady,
        EFFECTS.PositiveImage,
        EFFECTS.RevealedCharacters,
        EFFECTS.NotCrossedOut,
    ].map((token) => ({ token, precedence: PRECEDENCE.Medium })),
    ...[
        EFFECTS.Reset,
        EFFECTS.ColorMode8,
        EFFECTS.ColorMode256,
        EFFECTS.Foreground,
        EFFECTS.Background,
        EFFECTS.BrightForeground,
        EFFECTS.BrightBackground,
    ].map((token) => ({ token, precedence: PRECEDENCE.High })),
]

export const PARTIAL_TOKENS: string[] = [
    EFFECTS.Foreground,
    EFFECTS.Background,
    EFFECTS.BrightForeground,
    EFFECTS.BrightBackground,
    // second level
    EFFECTS.ColorMode8,
    EFFECTS.ColorMode256,
].reverse()

// \033[38;2;255;0;0;48;2;0;255;0m
