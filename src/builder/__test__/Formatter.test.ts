import { FormatterMap, LogFormat, LogFormatter } from '../formatter'

describe('LogFormatter Tests', () => {
    const htmlBuilder = jest.fn()
    const textBuilder = jest.fn()

    beforeAll(() => {
        FormatterMap[LogFormat.ColoredHtml] = {
            build: htmlBuilder,
        }
        FormatterMap[LogFormat.RawText] = {
            build: textBuilder,
        }
    })

    beforeEach(() => {
        htmlBuilder.mockReset()
        textBuilder.mockReset()
    })

    it('should use the right builder', () => {
        expect(htmlBuilder).not.toBeCalled()
        expect(textBuilder).not.toBeCalled()

        LogFormatter.format('', LogFormat.ColoredHtml)
        expect(htmlBuilder).toBeCalledTimes(1)
        expect(textBuilder).not.toBeCalled()

        LogFormatter.format('', LogFormat.RawText)
        expect(htmlBuilder).toBeCalledTimes(1)
        expect(textBuilder).toBeCalledTimes(1)
    })
})
