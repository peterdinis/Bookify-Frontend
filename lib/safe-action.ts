import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) return e.message;
    return "Something went wrong.";
  },
});
