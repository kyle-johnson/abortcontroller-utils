// @types/node currently doesn't provide full types
interface AbortSignal {
  addEventListener(
    event: "abort",
    handler: Function,
    opts?: { once?: boolean; signal?: AbortSignal }
  ): void;
  removeEventListener(event: "abort", handler: Function): void;
}
