# log-formatter

A javascript library for displaying color logs in the browser (by parsing and formatting SGR commands)!


## Features

- Parse SGR commands into an AST tree
- convert logs into a styled html representation
- remove ugly `\x1b[35m` statements from your logs
- get an array of attribute an style the logs for your self 

## Installation

`yarn add @log-rush/log-formatter`
or
`npm i  @log-rush/log-formatter`

## Usage

```typescript
document.body.innerHtml = LogFormatter.format(
    '\x1b[1;32mHello \x1b[34mWorld\x1b[0m'
    LogFormat.ColoredHtml,
    Optimization.O2
)
```
