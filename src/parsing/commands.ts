import {
    Color256,
    Color8,
    EffectKey,
    EFFECTS,
    BlinkEffect,
    ColorEffect,
    ColorModeEffect,
    ConcealedEffect,
    CrossedOutEffect,
    ItalicEffect,
    NegativeEffect,
    TextWeightEffect,
    UnderlineEffect,
} from './effects'
import { DefaultSGREffects, PropertyOf, SGREffect } from './types'

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
        if (command.startsWith(ChainCommandCharacter) || command.length === 0) {
            return {
                matches: true,
                remainingCommand: command.substring(1),
                alteredEffects: {
                    [key]: value,
                },
            }
        }
        return {
            matches: false,
        }
    }

const setEffects =
    (effects: Partial<SGREffect>): ParserFunc =>
    (command) => {
        if (command.startsWith(ChainCommandCharacter) || command.length === 0) {
            return {
                matches: true,
                remainingCommand: command.substring(1),
                alteredEffects: {
                    ...effects,
                },
            }
        }
        return {
            matches: false,
        }
    }

const setEffectsSetter =
    (
        valueSetter: (command: string) =>
            | {
                  effects: Partial<SGREffect>
                  remaining: string
              }
            | undefined,
    ): ParserFunc =>
    (command) => {
        const result = valueSetter(command)
        if (result) {
            return {
                matches: true,
                remainingCommand: result.remaining,
                alteredEffects: {
                    ...result.effects,
                },
            }
        }
        return { matches: false }
    }

const createParseColorResultMapper =
    (type: 'foreground' | 'background') => (command: string) => {
        const result = parseColor(command)
        if (!result) return undefined
        return {
            effects: {
                [type]: result.color,
                [`${type}Mode`]: result.mode,
            },
            remaining: result.remaining,
        }
    }

export type ColorResult = {
    color: string
    remaining: string
}

const ChainCommandCharacter = EFFECTS[EffectKey.ChainCommand]

export const parseColor = (
    command: string,
): (ColorResult & { mode: PropertyOf<typeof ColorModeEffect> }) | undefined => {
    if (command.startsWith(EFFECTS[EffectKey.ColorModeRGB])) {
        const result = parseRGBColor(
            command.slice(EFFECTS[EffectKey.ColorModeRGB].length),
        )
        if (!result) return undefined
        return {
            ...result,
            mode: ColorModeEffect[EffectKey.ColorModeRGB],
        }
    }
    if (command.startsWith(EFFECTS[EffectKey.ColorMode256])) {
        const result = parse256Color(
            command.slice(EFFECTS[EffectKey.ColorMode256].length),
        )
        if (!result) return undefined
        return {
            ...result,
            mode: ColorModeEffect[EffectKey.ColorMode256],
        }
    }
    if (command.startsWith(EFFECTS[EffectKey.ColorMode8])) {
        const result = parse8Color(
            command.slice(EFFECTS[EffectKey.ColorMode8].length),
        )
        if (!result) return undefined
        return {
            ...result,
            mode: ColorModeEffect[EffectKey.ColorMode8],
        }
    }
    return undefined
}

export const parseRGBColor = (command: string): ColorResult | undefined => {
    const amountsOfChainCharacters = command
        .split('')
        .reduce((sum, char) => sum + +(char === ChainCommandCharacter), 0)

    if (amountsOfChainCharacters >= 2) {
        const [r, g, b, ...rest] = command.split(ChainCommandCharacter)
        const [numR, numG, numB] = [r, g, b].map((str) => parseInt(str, 10))
        if ([numR, numG, numB].some(isNaN)) return undefined
        if ([numR, numG, numB].some((num) => num > 255)) return undefined
        return {
            color: `#${numR.toString(16).padStart(2, '0')}${numG
                .toString(16)
                .padStart(2, '0')}${numB.toString(16).padStart(2, '0')}`,
            remaining: rest.join(ChainCommandCharacter),
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
    } else if (command.includes(ChainCommandCharacter)) {
        const index = command.indexOf(ChainCommandCharacter)
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
    if (
        command.length === 1 &&
        Color8.some((color) => command === EFFECTS[color])
    ) {
        return {
            color: command,
            remaining: '',
        }
    } else if (command.length > 1 && command.includes(ChainCommandCharacter)) {
        const index = command.indexOf(ChainCommandCharacter)
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

export const CommandParserMap: Record<string, ParserFunc> = {
    [EffectKey.Reset]: (command) => {
        if (command.startsWith(ChainCommandCharacter) || command.length === 0) {
            return {
                matches: true,
                alteredEffects: DefaultSGREffects,
                remainingCommand: command.substring(1),
            }
        }
        return {
            matches: false,
        }
    },
    [EffectKey.Bold]: applyEffect('weight', TextWeightEffect[EffectKey.Bold]),
    [EffectKey.Faint]: applyEffect('weight', TextWeightEffect[EffectKey.Faint]),
    [EffectKey.Italic]: applyEffect('italic', ItalicEffect[EffectKey.Italic]),
    [EffectKey.Underline]: applyEffect(
        'underline',
        UnderlineEffect[EffectKey.Underline],
    ),
    [EffectKey.BlinkSlow]: applyEffect(
        'blink',
        BlinkEffect[EffectKey.BlinkSlow],
    ),
    [EffectKey.BlinkRapid]: applyEffect(
        'blink',
        BlinkEffect[EffectKey.BlinkRapid],
    ),
    [EffectKey.NegativeImage]: applyEffect(
        'inverted',
        NegativeEffect[EffectKey.NegativeImage],
    ),
    [EffectKey.ConcealedCharacters]: applyEffect(
        'concealed',
        ConcealedEffect[EffectKey.ConcealedCharacters],
    ),
    [EffectKey.CrossedOut]: applyEffect(
        'crossedOut',
        CrossedOutEffect[EffectKey.CrossedOut],
    ),
    [EffectKey.DoublyUnderlined]: applyEffect(
        'underline',
        UnderlineEffect[EffectKey.DoublyUnderlined],
    ),
    [EffectKey.NormalColorAndWeight]: setEffects({
        weight: TextWeightEffect.Default,
        foreground: ColorEffect.Default,
        background: ColorEffect.Default,
        foregroundMode: ColorModeEffect.Default,
        backgroundMode: ColorModeEffect.Default,
    }),
    [EffectKey.NotItalic]: applyEffect(
        'italic',
        ItalicEffect[EffectKey.NotItalic],
    ),
    [EffectKey.NotUnderlined]: applyEffect(
        'underline',
        UnderlineEffect[EffectKey.NotUnderlined],
    ),
    [EffectKey.Steady]: applyEffect('blink', BlinkEffect[EffectKey.Steady]),
    [EffectKey.PositiveImage]: applyEffect(
        'inverted',
        NegativeEffect[EffectKey.PositiveImage],
    ),
    [EffectKey.RevealedCharacters]: applyEffect(
        'concealed',
        ConcealedEffect[EffectKey.RevealedCharacters],
    ),
    [EffectKey.NotCrossedOut]: applyEffect(
        'crossedOut',
        CrossedOutEffect[EffectKey.NotCrossedOut],
    ),
    [EffectKey.Foreground]: setEffectsSetter(
        createParseColorResultMapper('foreground'),
    ),
    [EffectKey.BrightForeground]: setEffectsSetter(
        createParseColorResultMapper('foreground'),
    ),
    [EffectKey.Background]: setEffectsSetter(
        createParseColorResultMapper('background'),
    ),
    [EffectKey.BrightBackground]: setEffectsSetter(
        createParseColorResultMapper('background'),
    ),
}
