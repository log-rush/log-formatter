import { EFFECTS } from './effect'
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
