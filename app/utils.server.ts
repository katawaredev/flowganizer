import { json } from "@remix-run/server-runtime";
import type { Result } from "remix-domains";
import { errorMessagesForSchema } from "remix-domains";
import type { ZodObject, ZodRawShape } from "zod";

export function validationErrors<T, V extends ZodObject<ZodRawShape>>(
  result: Result<T>,
  schema: V
) {
  return json(
    { errors: errorMessagesForSchema(result.inputErrors, schema) },
    {
      status: 400,
    }
  );
}
