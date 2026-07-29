import { type Store } from "@reduxjs/toolkit";
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
