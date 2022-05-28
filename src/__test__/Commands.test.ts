import { CLIColorASTNode } from '../ast'
import {
    CommandParserMap,
    CommandResult,
    SuccessCommandResult,
} from '../commands'
import { EFFECTS } from '../effect'
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
} from '../types'
import { createSGREffects } from './testUtil'

const expectMatch = (result: CommandResult): result is SuccessCommandResult => {
    expect(result.matches).toBeTruthy()
    return result.matches
}
const expectKey = <T extends Record<string, V>, V = unknown>(
    object: T,
    key: keyof T | string,
    value?: T[keyof T] | V,
) => {
    expect(object[key]).toBeDefined()
    if (value) {
        expect(object[key]).toEqual(value)
    }
}

const createApplyCommandTestSuite =
    (
        command: typeof CommandParserMap[keyof typeof CommandParserMap],
        expectedEffects: Partial<SGREffect>,
    ) =>
    () => {
        it('should apply effects', () => {
            const result = command('')
            if (expectMatch(result)) {
                for (const [key, value] of Object.entries(expectedEffects)) {
                    expectKey(result.alteredEffects, key, value)
                }
            }
        })

        it('should should match', () => {
            const result = command('')
            expectMatch(result)
        })

        it('should return remaining command', () => {
            const result = command('xxx')
            if (expectMatch(result)) {
                expect(result.remainingCommand).toBe('xxx')
            }
        })
    }

describe('Command Tests', () => {
    describe('Reset', () => {
        it('should reset all effects', () => {
            const result = CommandParserMap[EFFECTS.Reset]('')
            if (expectMatch(result)) {
                for (const [key, value] of Object.entries(DefaultSGREffects)) {
                    expectKey(result.alteredEffects, key, value)
                }
            }
        })

        it('should should match', () => {
            const result = CommandParserMap[EFFECTS.Reset]('')
            expectMatch(result)
        })

        it('should return remaining command', () => {
            const result = CommandParserMap[EFFECTS.Reset]('xxx')
            if (expectMatch(result)) {
                expect(result.remainingCommand).toBe('xxx')
            }
        })
    })

    describe(
        'Bold',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.Bold], {
            weight: TextWeightEffect[EFFECTS.Bold],
        }),
    )

    describe(
        'Faint',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.Faint], {
            weight: TextWeightEffect[EFFECTS.Faint],
        }),
    )

    describe(
        'Italic',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.Italic], {
            italic: ItalicEffect[EFFECTS.Italic],
        }),
    )

    describe(
        'Underline',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.Underline], {
            underline: UnderlineEffect[EFFECTS.Underline],
        }),
    )

    describe(
        'BlinkSlow',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.BlinkSlow], {
            blink: BlinkEffect[EFFECTS.BlinkSlow],
        }),
    )

    describe(
        'BlinkRapid',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.BlinkRapid], {
            blink: BlinkEffect[EFFECTS.BlinkRapid],
        }),
    )

    describe(
        'NegativeImage',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.NegativeImage], {
            inverted: NegativeEffect[EFFECTS.NegativeImage],
        }),
    )

    describe(
        'ConcealedCharacters',
        createApplyCommandTestSuite(
            CommandParserMap[EFFECTS.ConcealedCharacters],
            { concealed: ConcealedEffect[EFFECTS.ConcealedCharacters] },
        ),
    )

    describe(
        'CrossedOut',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.CrossedOut], {
            crossedOut: CrossedOutEffect[EFFECTS.CrossedOut],
        }),
    )

    describe(
        'DoublyUnderlined',
        createApplyCommandTestSuite(
            CommandParserMap[EFFECTS.DoublyUnderlined],
            { underline: UnderlineEffect[EFFECTS.DoublyUnderlined] },
        ),
    )

    describe(
        'NormalColorAndWeight',
        createApplyCommandTestSuite(
            CommandParserMap[EFFECTS.NormalColorAndWeight],
            {
                weight: TextWeightEffect.Default,
                foreground: ColorEffect.Default,
                background: ColorEffect.Default,
                foregroundMode: ColorModeEffect.Default,
                backgroundMode: ColorModeEffect.Default,
            },
        ),
    )

    describe(
        'NotItalic',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.NotItalic], {
            italic: ItalicEffect[EFFECTS.NotItalic],
        }),
    )

    describe(
        'NotUnderlined',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.NotUnderlined], {
            underline: UnderlineEffect[EFFECTS.NotUnderlined],
        }),
    )

    describe(
        'Steady',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.Steady], {
            blink: BlinkEffect[EFFECTS.Steady],
        }),
    )

    describe(
        'PositiveImage',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.PositiveImage], {
            inverted: NegativeEffect[EFFECTS.PositiveImage],
        }),
    )

    describe(
        'RevealedCharacters',
        createApplyCommandTestSuite(
            CommandParserMap[EFFECTS.RevealedCharacters],
            { concealed: ConcealedEffect[EFFECTS.RevealedCharacters] },
        ),
    )

    describe(
        'NotCrossedOut',
        createApplyCommandTestSuite(CommandParserMap[EFFECTS.NotCrossedOut], {
            crossedOut: CrossedOutEffect[EFFECTS.NotCrossedOut],
        }),
    )
})
