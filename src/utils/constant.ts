export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const farmUnitColumnProperties = {
  "account_id": "str",
  "farm_unit_zone": "str",
  "fu_total_alloc_af": "number",
  "fu_sy_ac": "number",
  "fu_tw_ac": "number",
  "fu_alloc_af": "number",
  "fu_carryover_af": "number",
  "fu_total_adjustment_af": "number",
  "fu_etaw_af": "number",
  "fu_remain_af": "number",
  "fu_remain_pct": "number",
  "parcel_id": "str",
  "zone_abr": "str",
  "fu_etaw_pct": "number",
  "parcels": "str",
  "full_label": "str",
  "category": "str"
};
export const parcelColumnProperties = {
  "parcel_id": "str",
  "account_id": "str",
  "zone_name": "str",
  "zone_abr": "str",
  "alloc_af": "number",
  "primary_crop": "str",
  "legal_ac": "number",
  "carryover_af": "number",
  "coords": "str",
  "total_alloc_af": "number",
  'etaw_af': 'number',
  'remain_af': 'number',
  'remain_pct': 'number',
  'r_irr_ac': 'number',
};

export const clientColumnProperties = {
  "clientAdminAreaName": "str",
  "clientCountryName": "str",
  "clientDefaultUnitSystemName": "str",
  "clientEmail": "str",
  "clientEstablished": "str", // ISO date as string
  "clientFax": "str",
  "clientGeomHa": "number",
  "clientId": "str",
  "clientLegalHa": "number",
  "clientName": "str",
  "clientPhone": "str",
  "clientSubadminAreaName": "str",
  "clientSubadminAreaName2": "str",
  "clientSubsubadminAreaName": "str",
  "clientWebsite": "str",
  "contentTypeId": "number",
  "id": "number",
  "locality": "str",
  "objectId": "number",
  "poBox": "str",
  "postalCode": "str",
  "premise": "str",
  "street": "str",
  "subpremise": "str",
};

export const customerParcelColumnProperties = {
    customerName: "str",
    parcelIds: "str",
};
export const customerFieldColumnProperties = {
    customerName: "str",
    fieldPctFarmed: "str",
};
export const cropFieldColumnProperties = {
    cropName: "str",
    fieldPctFarmed: "str",
};
export const cropColumnProperties = {
    cropName: "str",
    cropDesc: "str",
};
export const fieldColumnProperties = {
    cropName: "str",
    cropDesc: "str",
};

export const parcelPageColumnProperties = {
    parcelName: "str",
    parcelGeomHa: "number",
    parcelIrrigHa: "number",
    parcelLegalHa: "number",
};
export const fieldPageColumnProperties = {
    fieldName: "str",
    fieldIrrigHa: "number",
    fieldLegalHa: "number",
    geomHa: "number",
    fieldActBool:"str"
};