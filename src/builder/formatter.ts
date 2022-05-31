import { WriteableSGRAstNode } from '../parsing/ast'
import { SGRCommandParser } from '../parsing/parser'
import { AttributeArrayBuilder, TextAttribute } from './attributeArray'
import { HTMLNodeBuilder } from './html'
import { SGROutputBuilder } from './interface'
import { RawTextBuilder } from './raw'

export enum LogFormat {
    ColoredHtml,
    RawText,
    AttributesArray,
}

export const FormatterMap: Record<LogFormat, SGROutputBuilder<unknown>> = {
    [LogFormat.ColoredHtml]: new HTMLNodeBuilder(),
    [LogFormat.RawText]: new RawTextBuilder(),
    [LogFormat.AttributesArray]: new AttributeArrayBuilder(),
}

export type FormattingType = {
    [LogFormat.ColoredHtml]: string
    [LogFormat.RawText]: string
    [LogFormat.AttributesArray]: TextAttribute[]
}

export class LogFormatBuilder {
    static format<F extends LogFormat>(
        rawLog: string,
        formatting: F,
    ): FormattingType[F] {
        const parser = new SGRCommandParser()
        const ast = parser.parse(rawLog)
        return FormatterMap[formatting].build(ast) as FormattingType[F]
    }

    static formatRaw<F extends LogFormat>(
        astHead: WriteableSGRAstNode,
        formatting: F,
    ): FormattingType[F] {
        return FormatterMap[formatting].build(astHead) as FormattingType[F]
    }
}
