import { LogFormat } from '../../../builder/formatter'
import { LogFormatter, Optimization } from '../../../LogFormatter'

describe('issue #1', () => {
    it('should parse "test | \\x1b[32mHello World" correctly', () => {
        const formatter = new LogFormatter({
            format: LogFormat.AttributesArray,
            optimizations: Optimization.O2,
        })

        const formatted = formatter.format('test | \\x1b[32mHello World')

        expect(formatted[0].content).toBe('test | ')
        expect(formatted[1].content).toBe('Hello World')

        expect(formatted[0].foreground).toBeUndefined()
        expect(formatted[1].foreground).toBeDefined()
    })
})
