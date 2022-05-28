import { parse256Color, parse8Color } from '../commands'
import { Color256, Color8 } from '../effect'

describe('ColorParsing tests', () => {
    describe('ColorMode 8', () => {
        it('should detect all possible colors', () => {
            for (const color of Color8) {
                expect(parse8Color(color)?.color).toEqual(color)
            }
        })

        it('should catch non ColorMode8 colors', () => {
            expect(parse8Color('x')).toBeUndefined()
            expect(parse8Color('a')).toBeUndefined()
            expect(parse8Color('\\')).toBeUndefined()
        })

        it('should detect chained commands', () => {
            expect(parse8Color('1;')?.color).toEqual('1')
            expect(parse8Color('2;;;')?.color).toEqual('2')
            expect(parse8Color('3;asdas;dsd;')?.color).toEqual('3')
        })

        it('should detect invalid chained commands', () => {
            expect(parse8Color('1x;')).toBeUndefined()
            expect(parse8Color('adsax;1;')).toBeUndefined()
        })

        it('should return correct remaining command', () => {
            expect(parse8Color('1;')?.remaining).toEqual('')
            expect(parse8Color('2;;;')?.remaining).toEqual(';;')
            expect(parse8Color('3;asdas;dsd;')?.remaining).toEqual('asdas;dsd;')
        })
    })

    describe('ColorMode 256', () => {
        it('should detect all possible colors', () => {
            for (const color of Color256) {
                expect(parse256Color(color)?.color).toEqual(color)
            }
        })

        it('should catch non ColorMode256 colors', () => {
            expect(parse256Color('x')).toBeUndefined()
            expect(parse256Color('300')).toBeUndefined()
            expect(parse256Color('a')).toBeUndefined()
            expect(parse256Color('\\')).toBeUndefined()
        })

        it('should detect chained commands', () => {
            expect(parse256Color('9;')?.color).toEqual('9')
            expect(parse256Color('46;;;')?.color).toEqual('46')
            expect(parse256Color('231;asdas;dsd;')?.color).toEqual('231')
        })

        it('should detect invalid chained commands', () => {
            expect(parse256Color('1x;')).toBeUndefined()
            expect(parse256Color('adsax;1;')).toBeUndefined()
            expect(parse256Color('299;1;')).toBeUndefined()
            expect(parse256Color('123x;1;')).toBeUndefined()
        })

        it('should return correct remaining command', () => {
            expect(parse256Color('12;')?.remaining).toEqual('')
            expect(parse256Color('231;;;')?.remaining).toEqual(';;')
            expect(parse256Color('99;asdas;dsd;')?.remaining).toEqual(
                'asdas;dsd;',
            )
        })
    })
})
