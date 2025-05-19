import { z } from "zod";

export const clientSchema = z.object({
  clientId: z.string().optional(),
  clientHa: z.coerce.number().optional(),
  clientCountry: z.string().optional(),
  clientAdminArea: z.string().optional(),
  clientSubadminArea: z.string().optional(),
  clientLocality: z.string().optional(),
  clientPostalCode: z.string().optional(),
  clientPoBox: z.string().optional(),
  clientStreet: z.string().optional(),
  clientPremise: z.string().optional(),
  clientSubpremise: z.string().optional(),
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
  clientShapeFile: z.array(z.instanceof(File)).optional(),

})

