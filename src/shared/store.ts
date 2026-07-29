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
  },
});

export const { increment, decrement } = counterSlice.actions;
export const { selectCount } = counterSlice.selectors;

const rootReducer = combineSlices(counterSlice);

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
