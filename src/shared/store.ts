import { createSlice, combineSlices, configureStore } from "@reduxjs/toolkit";

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

export const rootReducer = combineSlices(counterSlice);

export type PreloadedState = Parameters<typeof rootReducer>[0];

export function makeStore(preloadedState?: PreloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;

// A stable facade over a swappable inner store. `resetState()` doesn't reset state in
// place -- it throws the entire inner store away (reducer state, every middleware
// instance, every listener registered on it) and builds a brand-new one via makeStore().
// Every consumer keeps holding the same facade object, so nothing needs to know a reset
// happened.
//
// dispatch/getState/subscribe/etc are getters, not wrapper functions -- each property
// access resolves `inner` at that instant and hands back *that* inner store's own bound
// method. Whoever read it (a component's `useAppDispatch()`, a thunk's captured
// `dispatch`, anything) keeps that specific function forever, even across an `await`.
// So a reset doesn't retarget work that's already in flight: it just becomes a call into
// an orphaned, unsubscribed inner store that nothing reads from anymore -- the same
// isolation a fresh store per test gives you, without giving up the singleton reference.
// (A plain `dispatch: (action) => inner.dispatch(action)` wrapper would NOT have this
// property: it re-reads the mutable `inner` at call time, so a stale reference would
// silently retarget itself onto whatever store is current when it's finally invoked.)
export function makeResettableStore(preloadedState?: PreloadedState) {
  let inner = makeStore(preloadedState);

  return {
    get dispatch() {
      return inner.dispatch;
    },
    get getState() {
      return inner.getState;
    },
    get subscribe() {
      return inner.subscribe;
    },
    get replaceReducer() {
      return inner.replaceReducer;
    },
    get [Symbol.observable]() {
      return inner[Symbol.observable];
    },
    resetState: () => {
      inner = makeStore(preloadedState);
    },
  };
}
