import { makeDomainFunction } from "remix-domains";
import { z } from "zod";
import { createNote as createNewNote } from "~/models/note.server";

export const newNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

export const createNote = makeDomainFunction(
  newNoteSchema,
  z.string().cuid()
)(async ({ title, body }, userId) => {
  return await createNewNote({ title, body, userId });
});
