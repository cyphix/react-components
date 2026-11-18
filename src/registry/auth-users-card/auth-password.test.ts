import { describe, expect, it } from "vitest";
import { passwordPairSchema } from "./auth-password";

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
