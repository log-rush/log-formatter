import { SGRCommandParser } from '../parsing/parser'
import { HTMLNodeBuilder } from './html'
import { SGROutputBuilder } from './interface'
import { RawTextBuilder } from './raw'

export enum LogFormat {
    ColoredHtml,
    RawText,
}

export const FormatterMap: Record<LogFormat, SGROutputBuilder> = {
    [LogFormat.ColoredHtml]: new HTMLNodeBuilder(),
    [LogFormat.RawText]: new RawTextBuilder(),
}

export class LogFormatter {
    static format(rawLog: string, formatting: LogFormat): string {
        const parser = new SGRCommandParser()
        const ast = parser.parse(rawLog)
        return FormatterMap[formatting].build(ast)
    }
}
