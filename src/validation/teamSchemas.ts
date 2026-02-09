import { z } from "zod";

// Enterprise team management schemas

export const teamMemberFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email address").optional(),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  type: z.enum(["Direct Employee", "Contractor"]),
});

export type TeamMemberFormInput = z.infer<typeof teamMemberFormSchema>;
