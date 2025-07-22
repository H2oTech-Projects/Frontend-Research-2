import { ClientFormType, WaterAccoutingRatePeriodTypeForm, WaterAccoutingYearTypeForm } from "@/types/formTypes";

export const clientInitialValues: ClientFormType = {
  clientId: undefined,
  clientLegalHa: undefined,
  clientCountry: undefined,
  clientAdminArea: undefined,
  clientSubadminArea: undefined,
  clientSubsubadminArea: undefined,
  clientSubsubsubadminArea: undefined,
  clientLocality: "",
  clientPostalCode: "",
  clientPoBox: "",
  clientStreet: "",
  clientPremise: "",
  clientSubpremise: "",
  clientEmail: "",
  clientEstablished: undefined,
  clientFax: "",
  clientPhone: "",
  clientWebsite: "",
  clientName: "",
  uploadFile: undefined,
  clientDefaultUnitSystem: undefined,
  clientType: undefined,
}

export const waterAccountingRatePeriodInitialValues:  WaterAccoutingRatePeriodTypeForm = {
  waPeriodType: undefined,
  waPeriodTypeName: undefined,
}

export const waterAccountingYearInitialValues:  WaterAccoutingYearTypeForm = {
  waYear: undefined,
  waStartDate: undefined,
  waEndDate: undefined
}