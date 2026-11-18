import { z } from "zod";

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 512;

export const newPasswordSchema = z
  .string()
  .min(PASSWORD_MIN, `At least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX);

/** {newPassword, confirmPassword} with match refine on confirmPassword. */
export const passwordPairSchema = z
  .object({
    newPassword: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
