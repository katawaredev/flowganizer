import { InputError, makeDomainFunction } from "remix-domains";
import { z } from "zod";
import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect } from "~/utils";
import { verifyLogin } from "~/models/user.server";

export const joinSchema = z.object({
  email: z.string().email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password is too short"),
  redirectTo: z
    .string()
    .optional()
    .transform((val) => safeRedirect(val, "/~")),
});

export const join = makeDomainFunction(joinSchema)(async (fields) => {
  const existingUser = await getUserByEmail(fields.email);
  if (existingUser) {
    throw new InputError("A user already exists with this email", "email");
  }

  const user = await createUser(fields.email, fields.password);

  return { user, ...fields };
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password is too short"),
  redirectTo: z
    .string()
    .optional()
    .transform((val) => safeRedirect(val, "/~/notes")),
  remember: z
    .enum(["on"])
    .optional()
    .transform((val) => val === "on"),
});

export const login = makeDomainFunction(loginSchema)(async (fields) => {
  const user = await verifyLogin(fields.email, fields.password);
  if (!user) throw new InputError("Invalid email or password", "email");

  return { user, ...fields };
});

export default login;
