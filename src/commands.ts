import { Color256, Color8, EFFECTS } from './effect'
import { CLIColorASTNode } from './ast'
import {
    BlinkEffect,
    ColorEffect,
    ColorModeEffect,
    ConcealedEffect,
    CrossedOutEffect,
    DefaultSGREffects,
    ItalicEffect,
    NegativeEffect,
    PropertyOf,
    SGREffect,
    TextWeightEffect,
    UnderlineEffect,
} from './types'

export type FailedCommandResult = {
    matches: false
}
export type SuccessCommandResult = {
    matches: true
    alteredEffects: Partial<SGREffect>
    remainingCommand: string
}

export type CommandResult = FailedCommandResult | SuccessCommandResult

export type ParserFunc = (remainingCommand: string) => CommandResult

const applyEffect =
    <K extends keyof SGREffect>(key: K, value: SGREffect[K]): ParserFunc =>
    (command) => {
        return {
            matches: true,
            remainingCommand: command,
            alteredEffects: {
                [key]: value,
            },
        }
    }

const setEffects =
    (effects: Partial<SGREffect>): ParserFunc =>
    (command) => {
        return {
            matches: true,
            remainingCommand: command,
            alteredEffects: {
                ...effects,
            },
        }
    }

export type ColorResult = {
    color: string
    remaining: string
}

export const parseColor = (command: string): ColorResult | undefined => {
    if (command.startsWith(EFFECTS.ColorModeRGB))
        return parseRGBColor(command.slice(EFFECTS.ColorModeRGB.length))
    if (command.startsWith(EFFECTS.ColorMode256))
        return parse256Color(command.slice(EFFECTS.ColorMode256.length))
    if (command.startsWith(EFFECTS.ColorMode8))
        return parse8Color(command.slice(EFFECTS.ColorMode8.length))
    return undefined
}

export const parseRGBColor = (command: string): ColorResult | undefined => {
    const amountsOfChainCharacters = command
        .split('')
        .reduce((sum, char) => sum + +(char === EFFECTS.ChainCommand), 0)

    if (amountsOfChainCharacters >= 2) {
        const [r, g, b, ...rest] = command.split(EFFECTS.ChainCommand)
        const [numR, numG, numB] = [r, g, b].map((str) => parseInt(str, 10))
        if ([numR, numG, numB].some(isNaN)) return undefined
        if ([numR, numG, numB].some((num) => num > 255)) return undefined
        return {
            color: `#${numR.toString(16).padStart(2, '0')}${numG
                .toString(16)
                .padStart(2, '0')}${numB.toString(16).padStart(2, '0')}`,
            remaining: rest.join(EFFECTS.ChainCommand),
        }
    } else {
        return undefined
    }
}

export const parse256Color = (command: string): ColorResult | undefined => {
    if (command.length < 4 && Color256.some((color) => color === command)) {
        return {
            color: command,
            remaining: '',
        }
    } else if (command.includes(EFFECTS.ChainCommand)) {
        const index = command.indexOf(EFFECTS.ChainCommand)
        const result = parse256Color(command.substring(0, index))
        return result
            ? {
                  color: result.color,
                  remaining: command.substring(index + 1),
              }
            : undefined
    }
}

export const parse8Color = (command: string): ColorResult | undefined => {
    if (command.length === 1 && Color8.some((color) => color === command)) {
        return {
            color: command,
            remaining: '',
        }
    } else if (command.length > 1 && command.includes(EFFECTS.ChainCommand)) {
        const index = command.indexOf(EFFECTS.ChainCommand)
        const result = parse8Color(command.substring(0, index))
        return result
            ? {
                  color: result.color,
                  remaining: command.substring(index + 1),
              }
            : undefined
    }
    return undefined
}

export const CommandParserMap: Record<
    /*keyof typeof EFFECTS*/ string,
    ParserFunc
> = {
    [EFFECTS.Reset]: (command) => {
        return {
            matches: true,
            alteredEffects: DefaultSGREffects,
            remainingCommand: command,
        }
    },
    [EFFECTS.Bold]: applyEffect('weight', TextWeightEffect[EFFECTS.Bold]),
    [EFFECTS.Faint]: applyEffect('weight', TextWeightEffect[EFFECTS.Faint]),
    [EFFECTS.Italic]: applyEffect('italic', ItalicEffect[EFFECTS.Italic]),
    [EFFECTS.Underline]: applyEffect(
        'underline',
        UnderlineEffect[EFFECTS.Underline],
    ),
    [EFFECTS.BlinkSlow]: applyEffect('blink', BlinkEffect[EFFECTS.BlinkSlow]),
    [EFFECTS.BlinkRapid]: applyEffect('blink', BlinkEffect[EFFECTS.BlinkRapid]),
    [EFFECTS.NegativeImage]: applyEffect(
        'inverted',
        NegativeEffect[EFFECTS.NegativeImage],
    ),
    [EFFECTS.ConcealedCharacters]: applyEffect(
        'concealed',
        ConcealedEffect[EFFECTS.ConcealedCharacters],
    ),
    [EFFECTS.CrossedOut]: applyEffect(
        'crossedOut',
        CrossedOutEffect[EFFECTS.CrossedOut],
    ),
    [EFFECTS.DoublyUnderlined]: applyEffect(
        'underline',
        UnderlineEffect[EFFECTS.DoublyUnderlined],
    ),
    [EFFECTS.NormalColorAndWeight]: setEffects({
        weight: TextWeightEffect.Default,
        foreground: ColorEffect.Default,
        background: ColorEffect.Default,
        foregroundMode: ColorModeEffect.Default,
        backgroundMode: ColorModeEffect.Default,
    }),
    [EFFECTS.NotItalic]: applyEffect('italic', ItalicEffect[EFFECTS.NotItalic]),
    [EFFECTS.NotUnderlined]: applyEffect(
        'underline',
        UnderlineEffect[EFFECTS.NotUnderlined],
    ),
    [EFFECTS.Steady]: applyEffect('blink', BlinkEffect[EFFECTS.Steady]),
    [EFFECTS.PositiveImage]: applyEffect(
        'inverted',
        NegativeEffect[EFFECTS.PositiveImage],
    ),
    [EFFECTS.RevealedCharacters]: applyEffect(
        'concealed',
        ConcealedEffect[EFFECTS.RevealedCharacters],
    ),
    [EFFECTS.NotCrossedOut]: applyEffect(
        'crossedOut',
        CrossedOutEffect[EFFECTS.NotCrossedOut],
    ),
}
