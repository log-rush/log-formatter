import { TOKENS } from '../effects'

describe('Token tests', () => {
    test('TOKENS should be ordered by precedence', () => {
        for (let i = 0; i < TOKENS.length - 1; i++) {
            expect(TOKENS[i].precedence).toBeGreaterThanOrEqual(
                TOKENS[i + 1].precedence,
            )
        }
    })
})
