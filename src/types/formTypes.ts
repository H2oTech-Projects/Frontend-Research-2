import { clientSchema, waterAccountingRatePeriodSchema, waterAccountingPeriodTypeSchema } from "@/utils/schemaValidations/formSchema";
import { z } from "zod";

export type ClientFormType = z.infer<typeof clientSchema>;
export type WaterAccoutingRatePeriodFormType = z.infer<typeof waterAccountingRatePeriodSchema>;
export type WaterAccoutingPeriodTypeForm = z.infer<typeof waterAccountingPeriodTypeSchema>;