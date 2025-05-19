import { clientSchema } from "@/utils/schemaValidations/formSchema";
import { z } from "zod";

export type ClientFormType = z.infer<typeof clientSchema>;