import { page } from "vite-plus/test/browser";
import { render, type RenderOptions } from "vitest-browser-react";
import { Provider } from "react-redux";
import { makeStore, type PreloadedState, type AppStore } from "../src/shared/store";

export interface RenderWithProviderOptions extends RenderOptions {
  preloadedState?: PreloadedState;
  store?: AppStore;
}

export async function renderWithProvider(
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

  const result = await render(ui, { wrapper: Wrapper, ...renderOptions });
  return {
    ...result,
    store,
  };
}

// convenient but not required

declare module "vite-plus/test/browser" {
  export interface BrowserPage {
    renderWithProvider: typeof renderWithProvider;
  }
}

page.extend({
  renderWithProvider,
});
