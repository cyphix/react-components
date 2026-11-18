import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PasswordDialog } from "./password-dialog";

afterEach(cleanup);

function renderDialog(
	props: Partial<Parameters<typeof PasswordDialog>[0]> = {},
) {
	const onSubmit = vi.fn();
	render(
		<PasswordDialog
			isPending={false}
			onOpenChange={vi.fn()}
			onSubmit={onSubmit}
			open
			requireCurrent={false}
			submitLabel="Save password"
			title="Set password"
			{...props}
		/>,
	);
	return { onSubmit };
}

describe("PasswordDialog", () => {
	it("blocks mismatched passwords and does not submit", async () => {
		const { onSubmit } = renderDialog();
		await userEvent.type(
			screen.getByLabelText("New password"),
			"long-enough-password",
		);
		await userEvent.type(
			screen.getByLabelText("Confirm password"),
			"different-password",
		);
		await userEvent.click(
			screen.getByRole("button", { name: "Save password" }),
		);
		expect(
			await screen.findByText("Passwords do not match"),
		).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("rejects a short password", async () => {
		const { onSubmit } = renderDialog();
		await userEvent.type(screen.getByLabelText("New password"), "short");
		await userEvent.type(screen.getByLabelText("Confirm password"), "short");
		await userEvent.click(
			screen.getByRole("button", { name: "Save password" }),
		);
		expect(
			await screen.findByText("At least 8 bytes"),
		).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("submits a valid matching pair", async () => {
		const { onSubmit } = renderDialog();
		await userEvent.type(
			screen.getByLabelText("New password"),
			"long-enough-password",
		);
		await userEvent.type(
			screen.getByLabelText("Confirm password"),
			"long-enough-password",
		);
		await userEvent.click(
			screen.getByRole("button", { name: "Save password" }),
		);
		expect(onSubmit).toHaveBeenCalledWith({
			currentPassword: "",
			newPassword: "long-enough-password",
		});
	});

	it("hides the current-password field when requireCurrent is false", () => {
		renderDialog({ requireCurrent: false });
		expect(screen.queryByLabelText("Current password")).not.toBeInTheDocument();
	});

	it("requires the current password when requireCurrent is true", async () => {
		const { onSubmit } = renderDialog({ requireCurrent: true });
		await userEvent.type(
			screen.getByLabelText("New password"),
			"long-enough-password",
		);
		await userEvent.type(
			screen.getByLabelText("Confirm password"),
			"long-enough-password",
		);
		await userEvent.click(
			screen.getByRole("button", { name: "Save password" }),
		);
		expect(await screen.findByText("Required")).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});
});
