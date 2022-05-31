import {
    FormattingType,
    LogFormat,
    LogFormatBuilder,
} from './builder/formatter'
import { Optimize1 } from './optimization/o1'
import { Optimize2 } from './optimization/o2'
import { SGRCommandParser } from './parsing/parser'

export enum Optimization {
    O1,
    O2,
}

export type Options<F extends LogFormat> = {
    optimizations?: Optimization
    format: F
}

export class LogFormatter<F extends LogFormat> {
    static format<F extends LogFormat>(
        logs: string,
        format: F,
        optimization?: Optimization,
    ): FormattingType[F] {
        const parser = new SGRCommandParser()
        const ast = parser.parse(logs)

        if (optimization === Optimization.O1) {
            Optimize1(ast)
        } else if (optimization === Optimization.O2) {
            Optimize1(ast)
            Optimize2(ast)
        }

        return LogFormatBuilder.formatRaw(ast, format)
    }

    private parser: SGRCommandParser

    constructor(private readonly options: Options<F>) {
        this.parser = new SGRCommandParser()
    }

    format(logs: string): FormattingType[F] {
        const ast = this.parser.parse(logs)

        if (this.options.optimizations === Optimization.O1) {
            Optimize1(ast)
        } else if (this.options.optimizations === Optimization.O2) {
            Optimize1(ast)
            Optimize2(ast)
        }

        return LogFormatBuilder.formatRaw(ast, this.options.format)
    }
}
