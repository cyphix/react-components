import { z } from "zod";

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 512;

export const newPasswordSchema = z
  .string()
  .refine(value => new TextEncoder().encode(value).length >= PASSWORD_MIN, `At least ${PASSWORD_MIN} bytes`)
  .refine(value => new TextEncoder().encode(value).length <= PASSWORD_MAX, `At most ${PASSWORD_MAX} bytes`);

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
