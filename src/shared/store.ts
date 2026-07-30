import { createSlice, combineSlices, configureStore, type UnknownAction } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
  selectors: {
    selectCount: (state) => state.value,
    selectCountPlus: (state, amount: number) => state.value + amount,
  },
});

export const { increment, decrement } = counterSlice.actions;
export const { selectCount, selectCountPlus } = counterSlice.selectors;

const RESET = "store/reset";

// Drop-in replacement for combineSlices: same call signature, but the combined reducer resets
// to each slice's default initial state on a shared RESET action. Extra methods combineSlices
// attaches to its reducer (.inject()/.withLazyLoadedSlices()/.selector(), for runtime slice
// injection) are proxied through to the underlying reducer, so they keep working unchanged.
function combineSlicesWithResetWrapper<TSlices extends Parameters<typeof combineSlices>>(
  ...slices: TSlices
) {
  const combinedReducer = combineSlices(...slices);

  const resettableReducer = (
    state: ReturnType<typeof combinedReducer> | undefined,
    action: UnknownAction,
  ) =>
    action.type === RESET ? combinedReducer(undefined, action) : combinedReducer(state, action);

  return new Proxy(resettableReducer, {
    get: (target, prop, receiver) =>
      prop in target
        ? Reflect.get(target, prop, receiver)
        : Reflect.get(combinedReducer, prop, combinedReducer),
  }) as typeof combinedReducer;
}

export const rootReducer = combineSlicesWithResetWrapper(counterSlice);

export type PreloadedState = Parameters<typeof rootReducer>[0];

export function makeStore(preloadedState?: PreloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return Object.assign(store, {
    resetState: () => store.dispatch({ type: RESET }),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
