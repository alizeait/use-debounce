import React from "react";
import { useDebounce } from "../src/useDebounce";
import { fireEvent, render, act } from "@testing-library/react";
import { useState } from "react";

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.clearAllTimers();
});
describe("useDebounce", () => {
  function Component({ delay }: { delay?: number }) {
    const [value, setValue] = useState(0);
    const debouncedValue = useDebounce(value, delay);

    return (
      <div>
        <button
          onClick={() => {
            setValue((currentValue) => ++currentValue);
          }}
        />
        <p data-testid="actual">{value}</p>
        <p data-testid="debounced">{debouncedValue}</p>
      </div>
    );
  }
  test("debounces value when delay is set to 0", () => {
    const { getByTestId } = render(<Component delay={0} />);
    const actual = getByTestId("actual");
    const debounced = getByTestId("debounced");
    expect(actual.innerHTML).toBe("0");
    expect(debounced.innerHTML).toBe("0");
  });

  test("debounces value with requestAnimationFrame when delay is not set", () => {
    const originalRaf = window.requestAnimationFrame;
    const raf = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => originalRaf(cb));
    const { getByTestId, getByRole } = render(<Component />);
    const button = getByRole("button");
    const actual = getByTestId("actual");
    const debounced = getByTestId("debounced");
    expect(actual.innerHTML).toBe("0");
    expect(debounced.innerHTML).toBe("0");
    expect(raf).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    act(() => {
      jest.advanceTimersToNextTimer();
    });

    expect(actual.innerHTML).toBe("1");
    expect(debounced.innerHTML).toBe("1");
    expect(raf).toHaveBeenCalledTimes(2);
  });

  test("debounces value and respects delay", () => {
    const { getByTestId, getByRole } = render(<Component delay={2000} />);
    const button = getByRole("button");
    const actual = getByTestId("actual");
    const debounced = getByTestId("debounced");
    expect(actual.innerHTML).toBe("0");
    expect(debounced.innerHTML).toBe("0");

    fireEvent.click(button);
    expect(actual.innerHTML).toBe("1");
    expect(debounced.innerHTML).toBe("0");

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(actual.innerHTML).toBe("1");
    expect(debounced.innerHTML).toBe("1");

    act(() => {
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
    });
    expect(actual.innerHTML).toBe("5");
    expect(debounced.innerHTML).toBe("1");

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(actual.innerHTML).toBe("5");
    expect(debounced.innerHTML).toBe("5");
  });
});
