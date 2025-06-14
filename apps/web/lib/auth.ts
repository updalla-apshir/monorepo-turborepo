import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { FormState, SignupFormSchema } from "./types";

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
    email: formData.get("email"),
  });
  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
}
