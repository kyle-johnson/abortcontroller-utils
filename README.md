[AbortControllers](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) and [AbortSignals](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) are awesome, but they are extremely simple building blocks.

These utilities bring a few more _bulding blocks_ to make use of AbortController/AbortSignal a bit more concise for common use cases.

## [`abortcontroller-chain`](./packages/chain)
[![npm](https://img.shields.io/npm/v/abortcontroller-chain)](https://www.npmjs.com/package/abortcontroller-chain)

Contect an AbortController to one or more AbortSignals.
