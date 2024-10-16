# vite-react-cdn2

Vite の React で CDN を使ってみる。
Bun を使ったけど、npm, pnpm, yarn でも動くと思う。

## date-fns

をテストしてみる。こっちは簡単。var を dateFns にすればいい。

## Qix-/color

<https://cdn.jsdelivr.net/npm/color@4.2.3/index.js> を見るとわかるけど
バンドルが必要。

[Mottie/color-bundle: Rollup bundled version of Qix-/color](https://github.com/Mottie/color-bundle)
があるけど、更新されてない。

color-string と color-convert を読めばいいんだけど...

colorjs.io はサイズがデカくて気軽には使えない。
