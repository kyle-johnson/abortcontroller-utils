# Chain an `AbortController` to multiple `AbortSignals`

[![npm](https://img.shields.io/npm/v/abortcontroller-chain)](https://www.npmjs.com/package/abortcontroller-chain)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/kyle-johnson/abortcontroller-utils/CI)](https://github.com/kyle-johnson/rollup-plugin-optimize-lodash-imports/actions)
[![license](https://img.shields.io/npm/l/abortcontroller-chain)](https://github.com/kyle-johnson/abortcontroller-utils/blob/main/packages/chain/LICENSE)
[![Codecov](https://img.shields.io/codecov/c/github/kyle-johnson/abortcontroller-utils?flag=chain&label=coverage)](https://app.codecov.io/gh/kyle-johnson/abortcontroller-utils/)

Works with browsers, NodeJS (16+), and spec-compliant polyfills.

## Usage

At a minimum, you must pass one or more AbortSignals. However, the controller is optional: if a controller is _not_ passed in, one will be created and returned.

```typescript
import { chainAbortController } from "abortcontroller-chain";

// use your own controller
chainAbortController(controller, signal1, signal2, signal3);

// auto-create the controller
const controller = chainAbortController(signal1, signal2, signal3);
```

## Why

Say you're passing an AbortSignal into a long-running piece of code so you can end early if needed:

```typescript
async function pollSomething(signal: AbortSignal) {
  while (!signal.aborted) {
    // keep polling until the signal says stop
  }
}
```

But wait! You want to make an HTTP request with a _deadline_ of 10 seconds:

```typescript
const TEN_SECONDS = 10 * 1000; // ms
async function pollSomething(signal: AbortSignal) {
  while (!signal.aborted) {
    // abort after 500ms
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), TEN_SECONDS);

    // do the fetch...
    const result = await fetch("/something-something", {
      // wait, this doesn't take into account the signal
      // passed to pollSomething()
      signal: abortController.signal,
    });

    /* ... */
  }
}
```

Wouldn't it be great if the fetch-specific `abortController` could be aborted by the outer signal? That's easy with the `abortcontroller-chain` package:

```typescript
import { chainAbortController } from "abortcontroller-chain";

const TEN_SECONDS = 10 * 1000; // ms
async function pollSomething(signal: AbortSignal) {
  while (!signal.aborted) {
    const abortController = new AbortController();
    chainAbortController(abortController, signal);
    setTimeout(() => abortController.abort(), TEN_SECONDS);

    // do the fetch...
    const result = await fetch("/something-something", {
      // hooray! both signals are now respected
      signal: abortController.signal,
    });

    /* ... */
  }
}
```

You can further simplify the creation:

```typescript
const abortController = chainAbortController(signal);
setTimeout(() => abortController.abort(), TEN_SECONDS);
```
