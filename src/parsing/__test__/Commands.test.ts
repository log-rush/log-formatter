import {
    CommandParserMap,
    CommandResult,
    SuccessCommandResult,
} from '../commands'
import {
    BlinkEffect,
    ColorEffect,
    ColorModeEffect,
    ConcealedEffect,
    CrossedOutEffect,
    EffectKey,
    ItalicEffect,
    NegativeEffect,
    TextWeightEffect,
    UnderlineEffect,
} from '../effects'
import { DefaultSGREffects, SGREffect } from '../types'

const expectMatch = (result: CommandResult): result is SuccessCommandResult => {
    expect(result.matches).toBeTruthy()
    return result.matches
}
const expectKey = <
    T extends Record<string, V>,
    K extends keyof T | string = keyof T,
    V = unknown,
>(
    object: T,
    key: K,
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
            const result = command(';xxx')
            if (expectMatch(result)) {
                expect(result.remainingCommand).toBe('xxx')
            }
        })
    }

const createApplyColorTestSuite =
    (
        command: typeof CommandParserMap[keyof typeof CommandParserMap],
        type: 'foreground' | 'background',
    ) =>
    () => {
        it('should apply effects', () => {
            const tests = [
                {
                    input: '5',
                    color: '5',
                    mode: ColorModeEffect[EffectKey.ColorMode8],
                },
                {
                    input: '8;2;12;13;14',
                    color: '#0c0d0e',
                    mode: ColorModeEffect[EffectKey.ColorModeRGB],
                },
                {
                    input: '8;5;124',
                    color: '124',
                    mode: ColorModeEffect[EffectKey.ColorMode256],
                },
                {
                    input: '3;adsal',
                    color: '3',
                    mode: ColorModeEffect[EffectKey.ColorMode8],
                },
            ]
            for (const testCase of tests) {
                const result = command(testCase.input)
                if (expectMatch(result)) {
                    expectKey<Partial<SGREffect>, keyof Partial<SGREffect>>(
                        result.alteredEffects,
                        type,
                        testCase.color,
                    )
                    expectKey<Partial<SGREffect>, keyof Partial<SGREffect>>(
                        result.alteredEffects,
                        `${type}Mode`,
                        testCase.mode,
                    )
                }
            }
        })

        it('should should match', () => {
            expectMatch(command('5'))
            expectMatch(command('8;2;12;4;2'))
            expectMatch(command('8;5;31'))
        })

        it('should return remaining command', () => {
            const tests = [
                {
                    input: '5;xxx',
                    remaining: 'xxx',
                },
                {
                    input: '8;2;12;5;29;32',
                    remaining: '32',
                },
                {
                    input: '8;5;222;13;2',
                    remaining: '13;2',
                },
            ]
            for (const testCase of tests) {
                const result = command(testCase.input)
                if (expectMatch(result)) {
                    expect(result.remainingCommand).toBe(testCase.remaining)
                }
            }
        })
    }

describe('Command Tests', () => {
    describe('Reset', () => {
        it('should reset all effects', () => {
            const result = CommandParserMap[EffectKey.Reset]('')
            if (expectMatch(result)) {
                for (const [key, value] of Object.entries(DefaultSGREffects)) {
                    expectKey(result.alteredEffects, key, value)
                }
            }
        })

        it('should should match', () => {
            const result = CommandParserMap[EffectKey.Reset]('')
            expectMatch(result)
        })

        it('should return remaining command', () => {
            const result = CommandParserMap[EffectKey.Reset](';xxx')
            if (expectMatch(result)) {
                expect(result.remainingCommand).toBe('xxx')
            }
        })
    })

    describe(
        'Bold',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.Bold], {
            weight: TextWeightEffect[EffectKey.Bold],
        }),
    )

    describe(
        'Faint',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.Faint], {
            weight: TextWeightEffect[EffectKey.Faint],
        }),
    )

    describe(
        'Italic',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.Italic], {
            italic: ItalicEffect[EffectKey.Italic],
        }),
    )

    describe(
        'Underline',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.Underline], {
            underline: UnderlineEffect[EffectKey.Underline],
        }),
    )

    describe(
        'BlinkSlow',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.BlinkSlow], {
            blink: BlinkEffect[EffectKey.BlinkSlow],
        }),
    )

    describe(
        'BlinkRapid',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.BlinkRapid], {
            blink: BlinkEffect[EffectKey.BlinkRapid],
        }),
    )

    describe(
        'NegativeImage',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.NegativeImage], {
            inverted: NegativeEffect[EffectKey.NegativeImage],
        }),
    )

    describe(
        'ConcealedCharacters',
        createApplyCommandTestSuite(
            CommandParserMap[EffectKey.ConcealedCharacters],
            { concealed: ConcealedEffect[EffectKey.ConcealedCharacters] },
        ),
    )

    describe(
        'CrossedOut',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.CrossedOut], {
            crossedOut: CrossedOutEffect[EffectKey.CrossedOut],
        }),
    )

    describe(
        'DoublyUnderlined',
        createApplyCommandTestSuite(
            CommandParserMap[EffectKey.DoublyUnderlined],
            { underline: UnderlineEffect[EffectKey.DoublyUnderlined] },
        ),
    )

    describe(
        'NormalColorAndWeight',
        createApplyCommandTestSuite(
            CommandParserMap[EffectKey.NormalColorAndWeight],
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
        createApplyCommandTestSuite(CommandParserMap[EffectKey.NotItalic], {
            italic: ItalicEffect[EffectKey.NotItalic],
        }),
    )

    describe(
        'NotUnderlined',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.NotUnderlined], {
            underline: UnderlineEffect[EffectKey.NotUnderlined],
        }),
    )

    describe(
        'Steady',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.Steady], {
            blink: BlinkEffect[EffectKey.Steady],
        }),
    )

    describe(
        'PositiveImage',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.PositiveImage], {
            inverted: NegativeEffect[EffectKey.PositiveImage],
        }),
    )

    describe(
        'RevealedCharacters',
        createApplyCommandTestSuite(
            CommandParserMap[EffectKey.RevealedCharacters],
            { concealed: ConcealedEffect[EffectKey.RevealedCharacters] },
        ),
    )

    describe(
        'NotCrossedOut',
        createApplyCommandTestSuite(CommandParserMap[EffectKey.NotCrossedOut], {
            crossedOut: CrossedOutEffect[EffectKey.NotCrossedOut],
        }),
    )

    describe(
        'Foreground',
        createApplyColorTestSuite(
            CommandParserMap[EffectKey.Foreground],
            'foreground',
        ),
    )

    describe(
        'BrightForeground',
        createApplyColorTestSuite(
            CommandParserMap[EffectKey.BrightForeground],
            'foreground',
        ),
    )

    describe(
        'Background',
        createApplyColorTestSuite(
            CommandParserMap[EffectKey.Background],
            'background',
        ),
    )

    describe(
        'BrightBackground',
        createApplyColorTestSuite(
            CommandParserMap[EffectKey.BrightBackground],
            'background',
        ),
    )
})
