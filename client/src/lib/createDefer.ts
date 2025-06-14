export interface TDefer<T = void> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: unknown) => void;
}

export function createDefer<T = void>() {
  let _resolve: undefined | TDefer<T>['resolve'];
  let _reject: undefined | TDefer<T>['reject'];

  const promise = new Promise<T>((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  return {
    // Defered data
    promise,
    resolve: _resolve,
    reject: _reject,
  } as TDefer<T>;
}
