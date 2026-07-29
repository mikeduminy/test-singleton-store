export interface CounterDisplayProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function CounterDisplay({ count, onIncrement, onDecrement }: CounterDisplayProps) {
  return (
    <>
      <p>
        Count: <output>{count}</output>
      </p>
      <button onClick={onIncrement}>Increment</button>
      <button onClick={onDecrement}>Decrement</button>
    </>
  );
}
