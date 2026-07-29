import { CounterDisplay } from "../shared/CounterDisplay";
import { decrement, increment, selectCount } from "../shared/store";
import { useAppDispatch, useAppSelector } from "./hooks";

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <CounterDisplay
      count={count}
      onIncrement={() => dispatch(increment())}
      onDecrement={() => dispatch(decrement())}
    />
  );
}
