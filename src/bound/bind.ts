import { type Store } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook } from "react-redux";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";
export function createBoundHooks<TStore extends Store>(store: TStore) {
  type TState = ReturnType<TStore["getState"]>;
  return {
    useStore: () => store,
    useDispatch: () => store.dispatch,
    useSelector: <TSelected>(
      selector: (state: TState) => TSelected,
      isEqual?: (a: TSelected, b: TSelected) => boolean,
    ) =>
      useSyncExternalStoreWithSelector(
        // oxlint-disable-next-line typescript/unbound-method
        store.subscribe,
        // oxlint-disable-next-line typescript/unbound-method
        store.getState,
        // oxlint-disable-next-line typescript/unbound-method
        store.getState,
        selector,
        isEqual,
      ),
  };
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;

export function createBoundSelectorHooks<
  TRootState,
  TSelectors extends Record<string, (state: TRootState, ...args: any[]) => any>,
>(
  useSelector: TypedUseSelectorHook<TRootState>,
  selectors: TSelectors,
): {
  [K in keyof TSelectors as `use${Capitalize<string & K>}`]: (
    ...args: Tail<Parameters<TSelectors[K]>>
  ) => ReturnType<TSelectors[K]>;
} {
  const hooks: Record<string, () => unknown> = {};

  for (const key in selectors) {
    const selector = selectors[key];
    const hookName = `use${capitalize(key)}`;
    hooks[hookName] = (...args: any[]) => useSelector((state) => selector(state, ...args));
  }
  return hooks as never;
}
