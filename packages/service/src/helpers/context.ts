import { AsyncLocalStorage } from "async_hooks";
import { IContext } from "../type";

const context = new AsyncLocalStorage<IContext>();

export function run<T>(init: IContext, fn: () => T): T {
  return context.run(init, fn);
}

export function getContext() {
  return context.getStore();
}

export function set<K extends keyof IContext>(key: K, value: IContext[K]) {
  const context = getContext();
  if (context) {
    context[key] = value;
  }
}

export function get<K extends keyof IContext>(key: K) {
  const context = getContext();
  return context?.[key];
}
