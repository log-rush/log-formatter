import { SGRAstNode } from '../ast'
import { SGRCommandParser } from '../parser'

describe('Detect SGR Sequences', () => {
    const parser = new SGRCommandParser()
    let commandParser: jest.Mock

    beforeEach(() => {
        commandParser = jest.fn().mockImplementation(() => SGRAstNode.New())
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
        expect(commandParser.mock.calls[0][0]).toEqual(command)
        expect(commandParser).toBeCalledTimes(1)
        parser.parse(data2)
        expect(commandParser.mock.calls[1][0]).toEqual(command)
        expect(commandParser).toBeCalledTimes(2)
        parser.parse(data3)
        expect(commandParser.mock.calls[2][0]).toEqual(command)
        expect(commandParser).toBeCalledTimes(3)
        parser.parse(data4)
        expect(commandParser.mock.calls[3][0]).toEqual(command)
        expect(commandParser).toBeCalledTimes(4)
    })

    it('should detect multiple commands', () => {
        const command = '37;48;2;12;24;36'
        const data = `\x1b[${command}m hello world \x1b[${command};1m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).toBeCalledWith(command)
        expect(commandParser).toHaveBeenCalledTimes(2)
    })

    it('should detect adjacent commands', () => {
        const command = '37;48;2;12;24;36'
        const data = `\x1b[${command}m\x1b[${command}m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).toBeCalledWith(command)
        expect(commandParser).toHaveBeenCalledTimes(2)
    })

    it('should detect multiple commands of different types', () => {
        const commands = ['1;32', '3', '47;93', '5']
        const data = `\x1b[${commands[0]}m hello world \\e[${commands[1]}m \\u1b[${commands[2]}m \u001b[${commands[3]}m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        for (const args of commandParser.mock.calls as any[][]) {
            expect(commands.some((c) => args.includes(c))).toBeTruthy()
        }
        expect(commandParser).toHaveBeenCalledTimes(4)
    })

    it('should not match whiteout opening byte ', () => {
        const data = `\x1b31m`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).not.toBeCalled()
    })

    it('should close after closing byte regardless of content', () => {
        const data = `\x1b[31 Hello Worldm`
        expect(commandParser).not.toBeCalled()
        parser.parse(data)
        expect(commandParser).toBeCalledTimes(1)
        expect(commandParser).toBeCalledWith('31 Hello World')
    })
})
