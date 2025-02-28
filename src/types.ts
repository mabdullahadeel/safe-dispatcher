import type { EventDispatcher } from "./EventDispatcher";

export type ExtractGeneric<T> = T extends EventDispatcher<infer U> ? U : never;
