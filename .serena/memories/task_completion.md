# Task Completion Checklist for Xəzər Monitor

Before considering a task complete, ensure the following steps are performed:

1. **Linting**: Run `npm run lint` and ensure there are no errors or relevant warnings.
2. **Build Verification**: Run `npm run build` to ensure the project can be built without errors.
3. **Type Safety**: Verify that all new or modified code is fully typed with TypeScript.
4. **Environment Check**: Ensure no sensitive information (like API keys) is committed.
5. **Architectural Alignment**: Confirm that new API calls follow the proxy pattern and are placed in the appropriate `lib/` file.
6. **UI Consistency**: Ensure any new UI components use Tailwind CSS v4 and match the existing design aesthetic.
