# vite-react-cdn

Vite の React で CDN を使ってみる。Bun を使ったけど、npm, pnpm, yarn でも動くと思う

Vite の Plugin は 何種類かあるみたい。

- [vite-plugin-cdn-import - npm](https://www.npmjs.com/package/vite-plugin-cdn-import)
- [vite-plugin-cdn2 - npm](https://www.npmjs.com/package/vite-plugin-cdn2)

## 最初の実験 (tag: step1)

[上の vite-plugin-cdn-import を使って](https://www.npmjs.com/package/vite-plugin-cdn-import) jsDelivr から React まわりを取得してみる。
設定は [vite-plugin-cdn-import](https://www.npmjs.com/package/vite-plugin-cdn-import)の "Use preset" のところにあるやつを使用。

[vite.config.ts](vite.config.ts)参照。以下は要点だけ

```typescript
import cdn from "vite-plugin-cdn-import";

 plugins: [
  	cdn({
			modules: ["react", "react-dom"],
		}),
	],
```

`bun run dev` では ローカルの npm_modules/以下を使用する。`bun run build` して `bun run preview`

before:

```console
$ tsc -b && vite build
vite v5.4.7 building for production...
✓ 34 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-DiwrgTda.css    1.39 kB │ gzip:  0.72 kB
dist/assets/index-D2SP6z6Y.js   147.83 kB │ gzip: 48.42 kB
```

after:

```console
$ bun run build
$ tsc -b && vite build
vite v5.4.7 building for production...
✓ 20 modules transformed.
dist/index.html                  0.71 kB │ gzip: 0.37 kB
dist/assets/index-DiwrgTda.css   1.39 kB │ gzip: 0.72 kB
dist/assets/index-DOwLkL4p.js   13.77 kB │ gzip: 5.83 kB
```

`dist/index.html` には

```html
<!doctype html>
<html lang="en">
  <head>
    <script
      src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"
      crossorigin="anonymous"
    ></script>

    <meta charset="UTF-8" />
  </head>
</html>
```

みたいに挿入される。

```console
$ bun pm ls | grep react
(略)
├── react@18.3.1
├── react-dom@18.3.1
(略)
```

なのでバージョンも一致している (たまたま「最新」というだけかも)。

## ステップ 2 (tag: step2) - Preset packages にないものを使ってみる

[vite-plugin-cdn-import](https://www.npmjs.com/package/vite-plugin-cdn-import)の Preset にないものを使ってみる。

これを追加した。

- npmjs 上 - [cowsay - npm](https://www.npmjs.com/package/cowsay)
- jsDelivr 上 - [cowsay CDN by jsDelivr - A CDN for npm and GitHub](https://www.jsdelivr.com/package/npm/cowsay)

before:

```console
$ bun run build
$ tsc -b && vite build
vite v5.4.7 building for production...
✓ 22 modules transformed.
dist/index.html                  0.71 kB │ gzip: 0.37 kB
dist/assets/index-DGMOvZdB.css   1.46 kB │ gzip: 0.75 kB
dist/assets/index-6VT5elqj.js   17.17 kB │ gzip: 7.40 kB
```

Cowsay の分だけ `dist/assets/index-*.js` のサイズが増えてる。

vite.config.ts はこんな感じ

```typescript
cdn({
			modules: [
				"react",
				"react-dom",
				{
					name: "cowsay",
					var: "cowsay",
					path: "build/cowsay.umd.min.js",
				},
			],
		}),
```

name は `npm i`したパッケージの名前と一致させるらしい。

var は.tsx などで import してる名前と一致させるらしい。

after:

```
$ bun run build
$ tsc -b && vite build
vite v5.4.7 building for production...
✓ 21 modules transformed.
dist/index.html                  0.83 kB │ gzip: 0.39 kB
dist/assets/index-DGMOvZdB.css   1.46 kB │ gzip: 0.75 kB
dist/assets/index-C56sNEog.js   13.88 kB │ gzip: 5.88 kB
```

```html
<html lang="en">
  <head>
    <script
      src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/cowsay@1.6.0/build/cowsay.umd.min.js"
      crossorigin="anonymous"
    ></script>
  </head>
</html>
```

### 疑問点: UMD と build とは?

いろいろ解説を読んだけどよくわからん。
普通に npm publish してできるのは UMD ではないらしい。

jsDelivr などの該当ページ行って確認するしかない。

例えば

- [UNPKG - react](https://unpkg.com/browse/react@18.3.1/) umd フォルダ
- [UNPKG - cowsay](https://www.unpkg.com/browse/cowsay@1.6.0/) build フォルダ

## ステップ 3 - Cowsay を UNPKG から取ってみる

あれこれやったけど、こんな感じ

vite.config.ts:

```typescript
cdn({
			modules: [
				"react",
				"react-dom",
				{
					name: "cowsay",
					var: "cowsay",
					// path: "build/cowsay.umd.min.js",
					// jsDelivrの場合はこれで終わり
					// UNPKGの場合
					prodUrl: "https://unpkg.com/{name}@{version}/{path}",
					path: "build/cowsay.umd.js", //UNPKGにはminがないらしい
				},
			],
		}),
```

UNPKG に minify が無い件に関して、
UNPKG, jsDelivr, cdnjs はそれぞれ
ポリシーが違うらしい。

ざっくりとした比較を ChatGPT-4o に作ってもらった。

| 項目                   | UNPKG                                              | jsDelivr                                                 | CDNJS                                           |
| ---------------------- | -------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| **目的**               | npm パッケージをそのまま CDN 経由で配布            | npm、GitHub、WordPress からのファイル配布                | 人気のある Web ライブラリを事前にホストして配布 |
| **minify 版の提供**    | パッケージに含まれていれば提供するが、自動ではない | パッケージ内に minify 版があれば提供、ない場合は自動圧縮 | ほとんどのライブラリで minified 版を提供        |
| **ビルドや圧縮**       | なし(パッケージ内容に依存)                         | 自動圧縮やキャッシュ最適化をサポート                     | ライブラリに付属する minified 版を配布          |
| **柔軟なファイル指定** | npm パッケージ内の任意ファイルを指定可能           | 任意のバージョンやファイル指定が可能                     | ライブラリごとのファイルが事前にホスト          |
| **利用対象の範囲**     | npm のすべてのパッケージ                           | npm、GitHub、他のソースからも配布                        | 人気のあるライブラリに限定される                |
