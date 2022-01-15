import { chainAbortController } from "abortcontroller-chain";

export interface DeadlineController extends AbortController {
  /**
   * Clear any deadline, whether or not it has passed.
   */
  clearDeadline(): void;
}

/**
 * Returns an `AbortController` that is automatically aborted after `deadlineMilliseconds`. Optionally
 * connects one or more AbortSignals to the controller: if any of the signals aborts before the deadline,
 * the controller will be preemptively aborted.
 *
 * The returned controller has an additional method added: `clearDeadline(): void` which can be
 * called to clear the deadline timer. Clearing the deadline after using the controller is a best pratice
 * to avoid keeping around unused, but still pending, timers.
 *
 * @param deadlineMilliseconds
 * @param signals optional; if any of these abort, the deadline will be aborted even if `deadlineMilliseconds` hasn't yet passed
 * @returns an AbortController with an added `clearDeadline()` method to clear any deadline timer
 */
export function createDeadline(
  deadlineMilliseconds: number,
  ...signals: Array<AbortSignal>
): DeadlineController {
  const controller: DeadlineController = (
    signals.length === 0
      ? new AbortController()
      : chainAbortController(...signals)
  ) as DeadlineController;

  const timeoutHandle = setTimeout(() => {
    controller.abort();
  }, deadlineMilliseconds);
  controller.clearDeadline = () => clearTimeout(timeoutHandle);

  return controller;
}
