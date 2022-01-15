import { createDeadline } from ".";

describe("createDeadline", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("when the deadline passes, the controller is aborted", () => {
    const controller = createDeadline(1500);
    expect(controller.signal.aborted).toBe(false);

    // force the timeout to pass...
    jest.runAllTimers();

    // which should abort
    expect(controller.signal.aborted).toBe(true);
  });

  describe("clearDeadline()", () => {
    test("calling before the deadline cancels the deadline", () => {
      const controller = createDeadline(1500);
      expect(controller.signal.aborted).toBe(false);

      controller.clearDeadline();

      // force the timeout to pass...
      jest.runAllTimers();

      expect(controller.signal.aborted).toBe(false);
    });

    test("calling after the deadline causes no errors", () => {
      const controller = createDeadline(1500);
      expect(controller.signal.aborted).toBe(false);

      // force the timeout to pass...
      jest.runAllTimers();

      expect(controller.signal.aborted).toBe(true);
      expect(() => controller.clearDeadline()).not.toThrow();
    });
  });

  describe("chaining signals", () => {
    test("if a signal is aborted before calling createDeadline(), the controller is aborted", () => {
      const chainedController = new AbortController();
      chainedController.abort();
      const controller = createDeadline(1500, chainedController.signal);
      expect(controller.signal.aborted).toBe(true);
    });

    test("if a signal is aborted after calling createDeadline() but before the deadline passes, the controller is aborted", () => {
      const chainedController = new AbortController();
      const controller = createDeadline(1500, chainedController.signal);
      expect(controller.signal.aborted).toBe(false);

      chainedController.abort();
      expect(controller.signal.aborted).toBe(true);
    });

    test("if any one of multiple signals aborts, the controller is aborted", () => {
      const chainedController1 = new AbortController();
      const chainedController2 = new AbortController();
      const controller = createDeadline(
        1500,
        chainedController1.signal,
        chainedController2.signal
      );
      expect(controller.signal.aborted).toBe(false);

      chainedController2.abort();
      expect(controller.signal.aborted).toBe(true);
    });

    test("the deadline still works, even if all chained signals are not aborted", () => {
      const chainedController = new AbortController();
      const controller = createDeadline(1500, chainedController.signal);
      expect(controller.signal.aborted).toBe(false);
      jest.runAllTimers();
      expect(controller.signal.aborted).toBe(true);
    });
  });
});
