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

Using the `format()` method direct:

```typescript
import '@log-rush/log-formatter/dist/index.css';
import { LogFormat, LogFormatter, Optimization } from '@log-rush/log-formatter';

document.body.innerHtml = LogFormatter.format(
    '\x1b[1;32mHello \x1b[34mWorld\x1b[0m'
    LogFormat.ColoredHtml,
    Optimization.O2
)
```

or by creating a LogFormatter instance with the options:

```typescript
import '@log-rush/log-formatter/dist/index.css';
import { LogFormat, LogFormatter, Optimization } from '@log-rush/log-formatter';

const formatter = new LogFormatter({
  format: LogFormat.ColoredHtml,
  optimizations: Optimization.O2,
});

document.body.innerHtml = formatter.format('\x1b[1;32mHello \x1b[34mWorld\x1b[0m')
```

## Options

### Format


`LogFormat.ColoredHtml`: a string containing styled html

> Note: don't forget to import the "@log-rush/log-formatter/dist/index.css" stylesheet so that the all styles get applied

`LogFormat.RawText`: a string containing the raw text (excluding the sgr commands)

`LogFormat.AttributesArray`: an array containing chunks of content with the associated styles using the following format:

```typescript
export type TextAttribute = {
    weight?: 'bold' | 'faint'
    italic?: true
    underline?: 'single' | 'double'
    foreground?: string
    background?: string
    blink?: 'slow' | 'rapid'
    inverted?: true
    crossedOut?: true
    concealed?: true
    content: string
}
```

### Optimizations

Simply parsing the SGR commands may results in nodes with empty content or concatenated nodes with empty content or the same styles. This may results in a slight computation overhead (eg. rendering empty nodes or processing too much attributes). To solve this issue `@log-rush/log-formatter` comas with built-in optimizers:

`Optimization.O1` will remove all nodes with empty content in a single pass (O(n) complexity)

`Optimization.O2` will remove all nodes with empty content and merges nodes with the same attributes into a single node (O(n) complexity, but expensive attribute comparison)

## Facts

`@log-rush/log-formatter` runs in O(n) time and space complexity
