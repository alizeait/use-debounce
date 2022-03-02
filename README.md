# use-debounce ![Check](https://github.com/alizeait/use-debounce/workflows/Check/badge.svg) ![Coverage](https://img.shields.io/codecov/c/github/alizeait/use-debounce)

> A tiny (~230B) debounce hook.

Creates a debounced value that gets updated after `delay` milliseconds have
elapsed since the last time `useDebounce` was invoked.
If `delay` is omitted in an environment with `requestAnimationFrame`, value will be debounced until the
next frame is drawn (typically about 16ms).

## Installation

```bash
$ yarn add @alizeait/use-debounce
```

or

```bash
$ npm install @alizeait/use-debounce
```

## Usage

```jsx
import React, { useState } from "react";
import { useDebounce } from "@alizeait/use-debounce";

export default function Input() {
  const [value, setValue] = useState("Initial");
  const debouncedValue = useDebounce(value, 1000);

  return (
    <div>
      <input
        defaultValue="Initial"
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <p>Actual value: {value}</p>
      <p>Debounced value: {debouncedValue}</p>
    </div>
  );
}
```

## API

### useDebounce<T>(value:T, delay?:number)

Returns: `value`
