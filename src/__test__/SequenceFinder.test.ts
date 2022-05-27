import { Parser } from '../parse'

describe('Detect SGR Sequences', () => {
    const parser = new Parser()
    let commandParser: jest.Mock

    beforeEach(() => {
        commandParser = jest.fn()
        parser.parseSGRCommand = commandParser
    })

    it('should detect \\x1b', () => {
        const command = '37;48;2;12;24;36'
        const data = `\x1b[${command}m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).not.toBeCalledWith(command)
    })
})
