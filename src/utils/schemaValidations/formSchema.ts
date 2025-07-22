import { z } from "zod";

export const clientSchema = z.object({
  clientId: z.string().optional(),
  clientLegalHa: z.coerce.number().optional(),
  clientCountry: z.coerce.number().optional(),
  clientAdminArea: z.coerce.number().optional(),
  clientSubadminArea: z.coerce.number().optional(),
  clientLocality: z.string().optional(),
  clientPostalCode: z.string().optional(),
  clientPoBox: z.string().optional(),
  clientStreet: z.string().optional(),
  clientPremise: z.string().optional(),
  clientSubpremise: z.string().optional(),
  clientSubsubadminArea: z.coerce.number().optional(),
  clientSubsubsubadminArea: z.coerce.number().optional(),
  clientEmail: z.string().email().optional(),
  clientEstablished: z.coerce.date().optional(),
  clientFax: z.string().optional(),
  clientPhone: z.string().optional(),
  clientWebsite: z.string().url().optional(),
  // clientGeom: z.array(z.array(
  //   z.tuple([
  //     z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  //     z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  //   ])
  // )).min(1, "At least  coordinate is required"),
  clientName: z.string().optional(),
  uploadFile: z.array(z.instanceof(File)).optional(),
  clientDefaultUnitSystem:z.coerce.number().optional(),
  clientType: z.coerce.number().min(1, "Client type is required").optional(),
})

export const waterAccountingRatePeriodSchema = z.object({
  waRateTypeId: z.coerce.number().optional(),
  waPeriodName: z.coerce.number().optional(),
  waRateDetail: z.string().optional()
})

export const waterAccountingPeriodTypeSchema = z.object({
  waPeriodType: z.string().optional(),
  waPeriodTypeName: z.string().optional()
})

export const waterAccountingYearTypeSchema = z.object({
  waYear: z.string().optional(),
  waStartDate: z.string().optional(),
  waEndDate: z.string().optional(),
})

