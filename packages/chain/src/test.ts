import { chainAbortController } from ".";

describe("chainAbortController", () => {
  test("if a controller isn't provided, one is created", () => {
    const { signal } = new AbortController();

    const newController = chainAbortController(signal);
    expect(newController).toBeInstanceOf(AbortController);
    expect(newController.signal.aborted).toBe(false);
  });

  test("if a controller is provided, it is returned", () => {
    const controller = new AbortController();
    const { signal } = new AbortController();

    expect(chainAbortController(controller, signal)).toBe(controller);
  });

  test("an already aborted controller is not connected", () => {
    const controller = new AbortController();
    const { signal } = new AbortController();
    controller.abort();

    const addEventListernSpy = jest.spyOn(signal, "addEventListener");

    chainAbortController(controller, signal);
    expect(addEventListernSpy).not.toHaveBeenCalled();
    addEventListernSpy.mockRestore();
  });

  describe("one signal", () => {
    let signalController: AbortController;
    let signal: AbortSignal;

    beforeEach(() => {
      signalController = new AbortController();
      signal = signalController.signal;
    });

    test("signal is aborted after chain", () => {
      const newController = chainAbortController(signal);
      expect(newController.signal.aborted).toBe(false);
      signalController.abort();
      expect(newController.signal.aborted).toBe(true);
    });

    test("signal is aborted before chain", () => {
      signalController.abort();
      const newController = chainAbortController(signal);
      expect(newController.signal.aborted).toBe(true);
    });
  });

  describe("multiple signals", () => {
    let signalControllers: [AbortController, AbortController];
    let signals: [AbortSignal, AbortSignal];

    beforeEach(() => {
      signalControllers = [new AbortController(), new AbortController()];
      signals = [signalControllers[0].signal, signalControllers[1].signal];
    });

    describe("abort after chain", () => {
      test("first signal", () => {
        const newController = chainAbortController(...signals);
        expect(newController.signal.aborted).toBe(false);
        signalControllers[0].abort();
        expect(newController.signal.aborted).toBe(true);
      });

      test("second signal", () => {
        const newController = chainAbortController(...signals);
        expect(newController.signal.aborted).toBe(false);
        signalControllers[1].abort();
        expect(newController.signal.aborted).toBe(true);
      });

      test("all signals", () => {
        const newController = chainAbortController(...signals);
        expect(newController.signal.aborted).toBe(false);
        for (const controller of signalControllers) {
          controller.abort();
        }
        expect(newController.signal.aborted).toBe(true);
      });
    });

    describe("abort before chain", () => {
      test("first signal", () => {
        signalControllers[0].abort();
        const newController = chainAbortController(...signals);
        expect(newController.signal.aborted).toBe(true);
      });

      test("second signal", () => {
        signalControllers[1].abort();
        const newController = chainAbortController(...signals);
        expect(newController.signal.aborted).toBe(true);
      });

      test("all signals", () => {
        for (const controller of signalControllers) {
          controller.abort();
        }
        const newController = chainAbortController(...signals);
        expect(newController.signal.aborted).toBe(true);
      });
    });
  });
});
