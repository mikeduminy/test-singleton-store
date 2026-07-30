import "@testing-library/jest-dom/vitest";
import { afterEach } from "vite-plus/test";
import { cleanup, render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore, type PreloadedState, type AppStore } from "../src/shared/store";
import { store } from "../src/bound/hooks";

afterEach(() => {
  cleanup();
  store.resetState();
});

export interface RenderWithProviderOptions extends RenderOptions {
  preloadedState?: PreloadedState;
  store?: AppStore;
}

export function renderWithProvider(
  ui: React.ReactElement,
  {
    preloadedState,
    store = makeStore(preloadedState),
    ...renderOptions
  }: RenderWithProviderOptions = {},
) {
  const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  const result = render(ui, { wrapper: Wrapper, ...renderOptions });
  return {
    ...result,
    store,
  };
}
