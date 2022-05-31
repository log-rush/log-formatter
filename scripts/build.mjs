import 'zx/globals'
import { fs } from 'zx'

if (fs.existsSync('./dist')) {
    await $`rm -rf ./dist`
} else {
    await $`mkdir ./dist`
}

await $`yarn format`

await Promise.all([
    $`yarn build:browser`,
    $`yarn build:node`
])

await $`cp ./src/builder/assets/sgr.css ./dist/index.css`
