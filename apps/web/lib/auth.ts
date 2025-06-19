"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { SignupFormSchema, FormState, LoginFormSchema } from "./types";
import { error } from "console";
import { errorToJSON } from "next/dist/server/render";
import { createSession } from "./session";

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationFields.data),
  });
  if (response.ok) {
    redirect("/auth/signin");
  } else
    return {
      message:
        response.status === 409
          ? "The user is already existed!"
          : response.statusText,
    };
}

export const signIn = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const validationFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
  try {
    const response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validationFields.data),
    });

    console.log("Sign-in response status:", response.status);

    if (!response.ok) {
      return {
        message:
          response.status === 401 ? "Invalid credentials" : response.statusText,
      };
    }

    const result = await response.json();
    console.log("Sign-in response data:", result);

    if (!result || !result.id || !result.name || !result.accessToken) {
      console.error("Invalid response format:", result);
      return {
        message: "Server returned incomplete data",
      };
    }

    await createSession({
      user: {
        id: String(result.id),
        name: result.name,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    redirect("/");
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Sign-in error:", error);
    return {
      message: "An unexpected error occurred during sign-in",
    };
  }

  return {} as FormState;
};
