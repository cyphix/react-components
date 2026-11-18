import { describe, expect, it } from "vitest";
import { newPasswordSchema, passwordPairSchema } from "./auth-password";

describe("passwordPairSchema", () => {
	it("rejects a short password", () => {
		const result = passwordPairSchema.safeParse({
			newPassword: "short",
			confirmPassword: "short",
		});
		expect(result.success).toBe(false);
	});

	it("puts the mismatch error on confirmPassword", () => {
		const result = passwordPairSchema.safeParse({
			newPassword: "long-enough-password",
			confirmPassword: "different-password",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
		}
	});

	it("accepts a valid matching pair", () => {
		const result = passwordPairSchema.safeParse({
			newPassword: "long-enough-password",
			confirmPassword: "long-enough-password",
		});
		expect(result.success).toBe(true);
	});
});

it("measures UTF-8 bytes like goauth", () => {
 expect(newPasswordSchema.safeParse("éééé").success).toBe(true);
 expect(newPasswordSchema.safeParse("ééé").success).toBe(false);
 expect(newPasswordSchema.safeParse("😀".repeat(128)).success).toBe(true);
 expect(newPasswordSchema.safeParse("😀".repeat(129)).success).toBe(false);
});
