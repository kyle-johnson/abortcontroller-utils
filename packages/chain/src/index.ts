/**
 * Connects the given signals to the controller: if any signal aborts, the controller will
 * be aborted as well.
 *
 * @param controller {AbortController} optional; a new controller will be created and returned if not provided
 * @param signals {Array<AbortSignal>} the signals to connect to the controller
 * @returns {AbortController}
 */
export function chainAbortController(
  controller: AbortController,
  ...signals: Array<AbortSignal>
): AbortController;
export function chainAbortController(
  ...signals: Array<AbortSignal>
): AbortController;
export function chainAbortController(
  argument0: AbortController | AbortSignal,
  ...remainder: Array<AbortSignal>
): AbortController {
  let signals: Array<AbortSignal>;
  let controller: AbortController;

  // normalize args
  if (argument0 instanceof AbortSignal) {
    controller = new AbortController();
    signals = [argument0, ...remainder];
  } else {
    controller = argument0;
    signals = remainder;
  }

  // if the controller is already aborted, exit early
  if (controller.signal.aborted) {
    return controller;
  }

  const handler = () => controller.abort();

  for (const signal of signals) {
    // check before adding! (and assume there is no possible way that the signal could
    // abort between the `if` check and adding the event listener)
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener("abort", handler, {
      once: true,
      // this can free up memory by removing dangling references to the controller
      // (part of the DOM specification and works in Node 16+ (Node 14????))
      signal: controller.signal,
    });
  }

  return controller;
}
