---
name: lightningchart-js-trader
description: >
  Use LightningChart JS Trader to build accurate high-performance trading charts, graphs,
  dashboards, and data visualizations in JavaScript or TypeScript. Activate
  when working with LightningChart JS Trader, LCJS Trader, real-time data, large datasets,
  financial charts, WebGL charting, or any task that
  adds or modifies trading related charting/data visualization code.
license: MIT
compatibility: Requires internet access or locally cached copies of the LightningChart JS Trader LLM documentation indexes.
metadata:
  author: LightningChart Ltd
  version: "1.0"
  docs: https://lightningchart.com/js-charts/trader/docs/
---

## Purpose

Use this skill to work with LightningChart JS Trader without relying on stale model
training data. LightningChart JS Trader is a WebGL-accelerated JavaScript charting
library for high-performance rendering of large trading datasets, real-time streams,
financial charts, and dashboards.

## Mandatory Source Of Truth

Always use these two LLM index files as the source of truth for
LightningChart JS Trader usage:

- Documentation index: https://lightningchart.com/js-charts/trader/docs/llms.txt
- API index: https://lightningchart.com/js-charts/trader/api-documentation/llms.txt

These files are indexes. Read them to find the exact task-specific
documentation or API reference URL, then read that specific referenced page
before making assumptions how LightningChart JS Trader API works.

NEVER guess LightningChart JS Trader APIs, method names, constructor options, enum names,
configuration objects, import paths, or documentation URLs from memory.

## Common Errors

- Version matters. Prefer the URLs and API entries discovered from the supplied index unless the user or project explicitly targets another LightningChart JS trader version.
- The correct NPM package is `@lightningchart/lcjs-trader`, NOT `@arction/lcjs-trader`. Always install using the latest tag with `npm i @lightningchart/lcjs-trader@latest` unless specified otherwise, but do not leave `latest` in `package.json`.
- License key MUST be supplied to the `trader()` function. Import the function after installing the npm package. Setup trial license information in advance like this:

```ts
import { trader } from "@lightningchart/lcjs-trader";

trader('my-license-key')
    .then(ta => {
      const tradingChart = ta.tradingChart()
    })
```

- Tell the user to download their free trial license from https://lightningchart.com/js-charts/trader/ if they don't have one (IMPORTANT!).
- The trial license includes all the same features as the full (Ultimate) license.
- If your application creates several charts, it is best to reuse the same `trader()` context for all of them.
- If you want to combine LightningChart JS Trader with regular LightningChart JS, use the same `trader()` context for both of them. You don't need separate license keys for both products, since the regular LightningChart JS is included in the Trader package.

```ts
trader('my-license-key')
    .then(ta => {
      // Creating a TradingChart.
      const tradingChart = ta.tradingChart({ parentElement: traderDiv})

      // Creating a regular LightningChart in Trader applications.
      const xyChart = ta.lightningChart().ChartXY({ container: xyDiv })
    })
```

- With LightningChart JS Trader, you do NOT need to do things like handling ring buffers or data cleaning programmatically, or buffering data before passing to series. Just let LightningChart JS Trader handle things.

## Validation

If possible, rely on local type checks to confirm correct LightningChart JS Trader API usage.

## Upgrading LightningChart JS Trader version

When migrating to newer major versions, you might encounter minor backwards compatibility issues. If Trader's documentation at https://lightningchart.com/js-charts/trader/docs/ does not solve the issues, please contact technical support at support@lightningchart.com.
