import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debounceValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceValue;
}

export default useDebounce;
