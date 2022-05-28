import { SGRCommandParser } from '../parse'

describe('Detect SGR Sequences', () => {
    const parser = new SGRCommandParser()
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
        expect(commandParser).toBeCalledWith(command)
    })

    it('should from real example ', () => {
        const data = `[35mdebug`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).toBeCalledWith('35')
    })

    it('should detect \\e', () => {
        const command = '37;48;2;12;24;36'
        const data = `\\e[${command}m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).toBeCalledWith(command)
    })

    it('should detect alternatives \\x1b', () => {
        const command = '37;48;2;12;24;36'
        // const data = `\033[${command}m` octal not allowed in strict mode
        const data = `\u001b[${command}m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).toBeCalledWith(command)
    })

    it('should detect escaped sequences', () => {
        const command = '37;48;2;12;24;36'
        const data1 = `\\x1b[${command}m`
        const data2 = `\\033[${command}m`
        const data3 = `\\u1b[${command}m`
        const data4 = `\\u001b[${command}m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data1)
        expect(commandParser).toBeCalledWith(command)
        commandParser.mockReset()
        expect(commandParser).not.toBeCalled()
        parser.parse(data2)
        expect(commandParser).toBeCalledWith(command)
        commandParser.mockReset()
        expect(commandParser).not.toBeCalled()
        parser.parse(data3)
        expect(commandParser).toBeCalledWith(command)
        commandParser.mockReset()
        expect(commandParser).not.toBeCalled()
        parser.parse(data4)
        expect(commandParser).toBeCalledWith(command)
    })

    it('should detect multiple commands', () => {
        const command = '37;48;2;12;24;36'
        const data = `\x1b[${command}m hello world \x1b[${command}m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).toBeCalledWith(command)
        expect(commandParser).toHaveBeenCalledTimes(2)
    })

    it('should detect multiple commands of different types', () => {
        const command = '37;48;2;12;24;36'
        const data = `\x1b[${command}m hello world \\e[${command}m \\u1b[${command}m \u001b${command}m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).toBeCalledWith(command)
        expect(commandParser).toHaveBeenCalledTimes(4)
    })
})
