import { LogFormat, LogFormatter } from '../formatter'

describe('RawTextBuilder Tests', () => {
    it('should extract sgr commands', () => {
        const log =
            '2022-05-28T16:07:07.245+0200	[35mdebug[0m	[logstream]	started worker pool (16 instances)'
        const formatted = LogFormatter.format(log, LogFormat.RawText)
        expect(formatted).toEqual(
            '2022-05-28T16:07:07.245+0200	debug	[logstream]	started worker pool (16 instances)',
        )
    })
})
