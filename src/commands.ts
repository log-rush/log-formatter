import { EFFECTS } from './effect'
import { CLIColorASTNode } from './ast'
import {
    BlinkEffect,
    ColorEffect,
    ColorModeEffect,
    ConcealedEffect,
    CrossedOutEffect,
    ItalicEffect,
    SGREffect,
    TextWeightEffect,
    UnderlineEffect,
} from './types'

export type ParserFunc = (
    remainingCommand: string,
    currentAstNode: CLIColorASTNode,
) => CLIColorASTNode

const createNodeByAltering =
    <K extends keyof SGREffect>(key: K, value: SGREffect[K]): ParserFunc =>
    (_command, node) => {
        const newNode = node.clone()
        newNode.setEffect(key, value)
        newNode.setContent('')
        return node.insertAfter(newNode)
    }

export const CommandParserMap: Record<
    /*keyof typeof EFFECTS*/ string,
    ParserFunc
> = {
    [EFFECTS.Reset]: (_command, node) => {
        const newNode = node.Default()
        return node.insertAfter(newNode)
    },
    [EFFECTS.Bold]: createNodeByAltering(
        'weight',
        TextWeightEffect[EFFECTS.Bold],
    ),
    [EFFECTS.Faint]: createNodeByAltering(
        'weight',
        TextWeightEffect[EFFECTS.Faint],
    ),
    [EFFECTS.Italic]: createNodeByAltering(
        'italic',
        ItalicEffect[EFFECTS.Italic],
    ),
    [EFFECTS.Underline]: createNodeByAltering(
        'underline',
        UnderlineEffect[EFFECTS.Underline],
    ),
    [EFFECTS.BlinkSlow]: createNodeByAltering(
        'blink',
        BlinkEffect[EFFECTS.BlinkSlow],
    ),
    [EFFECTS.BlinkRapid]: createNodeByAltering(
        'blink',
        BlinkEffect[EFFECTS.BlinkRapid],
    ),
    // TODO: add negative image
    [EFFECTS.ConcealedCharacters]: createNodeByAltering(
        'concealed',
        ConcealedEffect[EFFECTS.ConcealedCharacters],
    ),
    [EFFECTS.CrossedOut]: createNodeByAltering(
        'crossedOut',
        CrossedOutEffect[EFFECTS.CrossedOut],
    ),
    [EFFECTS.DoublyUnderlined]: createNodeByAltering(
        'underline',
        UnderlineEffect[EFFECTS.DoublyUnderlined],
    ),
    [EFFECTS.NormalColorAndWeight]: (_command, node) => {
        const newNode = node.clone()
        newNode.setEffect('weight', TextWeightEffect.Default)
        newNode.setEffect('foreground', ColorEffect.Default)
        newNode.setEffect('background', ColorEffect.Default)
        newNode.setEffect('foregroundMode', ColorModeEffect.Default)
        newNode.setEffect('backgroundMode', ColorModeEffect.Default)
        newNode.setContent('')
        return node.insertAfter(newNode)
    },
    [EFFECTS.NotItalic]: createNodeByAltering(
        'italic',
        ItalicEffect[EFFECTS.NotItalic],
    ),
    [EFFECTS.NotUnderlined]: createNodeByAltering(
        'underline',
        UnderlineEffect[EFFECTS.NotUnderlined],
    ),
    [EFFECTS.Steady]: createNodeByAltering(
        'blink',
        BlinkEffect[EFFECTS.Steady],
    ),
    // TODO: add positive image
    [EFFECTS.RevealedCharacters]: createNodeByAltering(
        'concealed',
        ConcealedEffect[EFFECTS.RevealedCharacters],
    ),
    [EFFECTS.NotCrossedOut]: createNodeByAltering(
        'crossedOut',
        CrossedOutEffect[EFFECTS.NotCrossedOut],
    ),
}
