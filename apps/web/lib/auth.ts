"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { SignupFormSchema, FormState, LoginFormSchema } from "./types";
import { error } from "console";
import { errorToJSON } from "next/dist/server/render";

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

export const signin = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const validationFields = LoginFormSchema.safeParse(formData);
  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
  const response = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const result = await response.json();
    console.log(result);
  }
  return {
    message:
      response.status === 401 ? "invalid credentials" : response.statusText,
  };
};
