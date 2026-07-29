import { useSelector } from "react-redux";
import { makeStore, type RootState, selectCount, selectCountPlus } from "../shared/store";
import { createBoundHooks, createBoundSelectorHooks } from "./bind";

export const store = makeStore();

export const {
  useStore: useAppStore,
  useDispatch: useAppDispatch,
  useSelector: useAppSelector,
} = createBoundHooks(store);

export const { useSelectCount, useSelectCountPlus } = createBoundSelectorHooks(
  useSelector.withTypes<RootState>(),
  {
    selectCount,
    selectCountPlus,
  },
);
