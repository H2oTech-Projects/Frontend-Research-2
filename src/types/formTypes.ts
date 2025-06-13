import { clientSchema, waterAccountingRatePeriodSchema, waterAccountingPeriodTypeSchema, waterAccountingYearTypeSchema } from "@/utils/schemaValidations/formSchema";
import { z } from "zod";

export type ClientFormType = z.infer<typeof clientSchema>;
export type WaterAccoutingRatePeriodFormType = z.infer<typeof waterAccountingRatePeriodSchema>;
export type WaterAccoutingPeriodTypeForm = z.infer<typeof waterAccountingPeriodTypeSchema>;
export type WaterAccoutingYearTypeForm = z.infer<typeof waterAccountingYearTypeSchema>;