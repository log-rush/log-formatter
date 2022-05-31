import { parse256Color, parse8Color, parseColor, parseRGBColor } from '../commands'
import { Color256, Color8, EFFECTS } from '../effects'

describe('ColorParsing tests', () => {
    describe('ColorMode 8', () => {
        it('should detect all possible colors', () => {
            for (const color of Color8.map(key => EFFECTS[key])) {
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
            expect(parse256Color('99;asdas;dsd;')?.remaining).toEqual('asdas;dsd;')
        })
    })

    describe('ColorMode RGB', () => {
        it('should detect  possible colors', () => {
            expect(parseRGBColor('16;16;16')?.color?.toLocaleLowerCase()).toEqual('#101010')
            expect(parseRGBColor('192;168;0')?.color?.toLocaleLowerCase()).toEqual('#c0a800')
            expect(parseRGBColor('0;0;0')?.color?.toLocaleLowerCase()).toEqual('#000000')
        })

        it('should catch non ColorMode256 colors', () => {
            expect(parseRGBColor('2;2')).toBeUndefined()
            expect(parseRGBColor('saddasd')).toBeUndefined()
            expect(parseRGBColor('300;212;5')).toBeUndefined()
            expect(parseRGBColor('300;ccc;5')).toBeUndefined()
        })

        it('should detect chained commands', () => {
            expect(parseRGBColor('16;16;16;')?.color?.toLocaleLowerCase()).toEqual('#101010')
            expect(parseRGBColor('192;168;0;assadsa;a')?.color?.toLocaleLowerCase()).toEqual('#c0a800')
            expect(parseRGBColor('0;0;0;1;;;;adsad;')?.color?.toLocaleLowerCase()).toEqual('#000000')
        })

        it('should detect invalid chained commands', () => {
            expect(parseRGBColor('16;16;xxx')).toBeUndefined()
            expect(parseRGBColor('192;168;assadsa;a')).toBeUndefined()
        })

        it('should return correct remaining command', () => {
            expect(parseRGBColor('192;168;0')?.remaining).toEqual('')
            expect(parseRGBColor('192;168;0;xxx')?.remaining).toEqual('xxx')
            expect(parseRGBColor('192;168;0;xxx;aaa')?.remaining).toEqual('xxx;aaa')
            expect(parseRGBColor('192;168;0;;;;')?.remaining).toEqual(';;;')
        })
    })

    it('should detect the correct parser function', () => {
        expect(parseColor('1')?.color).toEqual('1')
        expect(parseColor('8;5;192')?.color).toEqual('192')
        expect(parseColor('8;2;16;16;16')?.color).toEqual('#101010')
    })

    it('should return undefined for invalid color definitions', () => {
        expect(parseColor('8;4')).toBeUndefined()
        expect(parseColor('x')).toBeUndefined()
    })

    it('should return correct ColorMode8 colors', () => {
        expect(parseColor('192')).toBeUndefined()
        expect(parseColor('5')?.color).toEqual('5')
    })
})
