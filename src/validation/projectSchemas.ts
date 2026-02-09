import { z } from "zod";

// GC MyProjects project create/update schemas

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  client: z.string().optional(),
  project_type: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  contract_value: z
    .number({ invalid_type_error: "Contract value must be a number" })
    .positive("Contract value must be greater than 0")
    .optional(),
  status: z.enum(["Planning", "Bidding", "Active", "Completed", "On Hold"]),
  start_date: z.string().optional(),
  expected_completion_date: z.string().optional(),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;
