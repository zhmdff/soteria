C:\Projects\Frontend Only\prevent-be42-late\app\air\page.tsx
11:36 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Projects\Frontend Only\prevent-be42-late\app\caspian\page.tsx
13:36 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Projects\Frontend Only\prevent-be42-late\app\climate\page.tsx
12:36 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Projects\Frontend Only\prevent-be42-late\app\page.tsx
12:36 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Projects\Frontend Only\prevent-be42-late\components\ChartPanel.tsx
19:9 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Projects\Frontend Only\prevent-be42-late\components\Map\MapContainer.tsx
37:5 error Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:

- Update external systems with the latest state from React.
- Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

C:\Projects\Frontend Only\prevent-be42-late\components\Map\MapContainer.tsx:37:5
35 |
36 | useEffect(() => {

> 37 | setIsMapLoading(true);

     |     ^^^^^^^^^^^^^^^ Avoid calling setState() directly within an effect

38 |
39 | if (timerRef.current) clearTimeout(timerRef.current);
40 | react-hooks/set-state-in-effect

C:\Projects\Frontend Only\prevent-be42-late\components\Map\MapControlPanel.tsx
98:71 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
105:29 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Projects\Frontend Only\prevent-be42-late\components\RenewableEnergyTool.tsx
7:42 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

✖ 9 problems (9 errors, 0 warnings)
