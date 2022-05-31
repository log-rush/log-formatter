import { LogFormat, LogFormatBuilder } from './builder/formatter'

const log =
    '2022-05-28T16:07:07.245+0200	[35mdebug[0m	[logstream]	started worker pool (16 instances)'

export const main = (str: string = log) => {
    const formatted = LogFormatBuilder.format(str, LogFormat.ColoredHtml)
    document.body.innerHTML = formatted
}

const clear = () => {
    document.body.innerHTML = ''
}

const run = (...args: any[]) => {
    main(...args)
}

// @ts-ignore
window.l_run = run
// @ts-ignore
window.l_clear = clear

console.log('loaded')
