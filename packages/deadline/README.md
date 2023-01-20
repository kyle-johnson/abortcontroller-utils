# Create an `AbortController` which aborts after a set number of milliseconds (a _deadline_)

[![npm](https://img.shields.io/npm/v/abortcontroller-deadline)](https://www.npmjs.com/package/abortcontroller-deadline)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/kyle-johnson/abortcontroller-utils/main.yml?branch=main)](https://github.com/kyle-johnson/abortcontroller-utils/actions)
[![license](https://img.shields.io/npm/l/abortcontroller-deadline)](https://github.com/kyle-johnson/abortcontroller-utils/blob/main/packages/deadline/LICENSE)
[![Codecov](https://img.shields.io/codecov/c/github/kyle-johnson/abortcontroller-utils?flag=deadline&label=coverage)](https://app.codecov.io/gh/kyle-johnson/abortcontroller-utils/)

Works with browsers, NodeJS (16+), and spec-compliant polyfills.

## Usage

### Basic

```typescript
import { createDeadline } from "abortcontroller-deadline";

// create an AbortController which aborts after 500 ms
const controller = createDeadline(500);

// use the controller! in this case, it ensures the fetch takes no longer than 500ms
try {
  const response = await fetch("https://example.com", {
    signal: controller.signal,
  });
  const data = await response.json();
} catch (error) {
  if (error instanceof fetch.AbortError) {
    console.log("Deadline exceeded");
  }
}
```

### Connecting existing signals

You can chain the output of other AbortSignals into the deadline: if any of the signals aborts _before_ the deadline, the deadline controller will be aborted too:

```typescript
const parentController = new AbortController();
const anotherController = new AbortController();

// if either parentController or anotherController abort, deadlineController
// will also abort, even if 500ms haven't passed
const deadlineController = createDeadline(
  500,
  parentController.signal,
  anotherController.signal
);
```

### Cleaning up timeouts / deadlines

Internally, the deadline is triggered by a timeout (from `setTimeout()`). While not required, it is a good practice to clean up any unused timeouts.

`createDeadline()` manages this by adding a `clearDeadline()` to any returned controller:

```typescript
import { createDeadline } from "abortcontroller-deadline";

const controller = createDeadline(500);

try {
  const response = await fetch("https://example.com", {
    signal: controller.signal,
  });
  /* ... */
} catch (error) {
  /* ... */
} finally {
  // clean up; this works whether or not the deadline occured
  controller.clearDeadline();
}
```
