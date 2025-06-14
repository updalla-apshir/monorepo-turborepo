import { z } from "zod";

export type FormState =
  | {
      error?: {
        name?: string;
        email?: string;
        password?: string;
      };
      message?: string;
    }
  | undefined;
