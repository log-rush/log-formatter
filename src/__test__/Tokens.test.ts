import { TOKENS } from '../effect'

describe('Token tests', () => {
    test('TOKENS should be ordered by precedence', () => {
        for (let i = 0; i < TOKENS.length - 1; i++) {
            expect(TOKENS[i].precedence).toBeLessThanOrEqual(
                TOKENS[i + 1].precedence,
            )
        }
    })
})
