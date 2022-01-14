export function chainAbortController(
  controller: AbortController,
  ...signals: Array<AbortSignal>
): AbortController;
export function chainAbortController(
  ...signals: Array<AbortSignal>
): AbortController;
export function chainAbortController(
  arg0: AbortController | AbortSignal,
  ...remainder: Array<AbortSignal>
): AbortController {
  let signals: Array<AbortSignal>;
  let controller: AbortController;

  // normalize args
  if (arg0 instanceof AbortSignal) {
    controller = new AbortController();
    signals = [arg0, ...remainder];
  } else {
    controller = arg0;
    signals = remainder;
  }

  // if the controller is already aborted, exit early
  if (controller.signal.aborted) {
    return controller;
  }

  const handler = () => controller.abort();

  for (const signal of signals) {
    // check before adding! (and assume there is no possible way that the signal could
    // abort between the `if` check and adding the the event listener)
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener("abort", handler, {
      once: true,
      // the reason for this is to free up memory a bit faster by removing dangling
      // references to the controller; it is part of the DOM specification and works
      // in Node 16+ (Node 14????)
      signal: controller.signal,
    });
  }

  return controller;
}
