# AbortController Utilities
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/kyle-johnson/abortcontroller-utils/CI)](https://github.com/kyle-johnson/abortcontroller-utils/actions)

[AbortControllers](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) and [AbortSignals](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) are awesome, but they are very simple building blocks.

These utilities bring a few more bulding blocks to make common use cases easy, such as [creating a deadline](./packages/deadline) or [chaining multiple signals into one controller](./packages/chain).

## [`abortcontroller-chain`](./packages/chain)
[![npm](https://img.shields.io/npm/v/abortcontroller-chain)](https://www.npmjs.com/package/abortcontroller-chain)
[![Codecov](https://img.shields.io/codecov/c/github/kyle-johnson/abortcontroller-utils?flag=chain&label=coverage)](https://app.codecov.io/gh/kyle-johnson/abortcontroller-utils/)

Contect an AbortController to one or more AbortSignals.

## [`abortcontroller-deadline`](./packages/deadline)
[![npm](https://img.shields.io/npm/v/abortcontroller-deadline)](https://www.npmjs.com/package/abortcontroller-deadline)
[![Codecov](https://img.shields.io/codecov/c/github/kyle-johnson/abortcontroller-utils?flag=deadline&label=coverage)](https://app.codecov.io/gh/kyle-johnson/abortcontroller-utils/)


Easily create an AbortController which aborts after a specified amount of time (a _deadline_).
