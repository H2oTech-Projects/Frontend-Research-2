interface AccountType {
  value: string;
  label: string;
}

export type AccountsListType = {
  data: AccountType[]
}

// type GeoJSONFeature = {
//   id: string;
//   type: string;
//   properties: {
//     apn: string;
//     polygon_coords: number[][][];
//   };
//   geometry: {
//     type: string;
//     coordinates: number[][][];
//   };
// };

export type AccountDetailType = {
  account_id: string;
  account_name: string;
  mailing_address: string;
  start_date: string;
  end_date: string;
  msmt_method: string;
  report_creation_date: string;
  report_revision_date: string;
  geojson_parcels: string;
  view_bounds: [number, number][];
};

export type AccountDetailResponseType = {
  data: AccountDetailType;
};

export interface ParcelDataType {
  parcel_id: string
  account_id: string,
  zone_name: string,
  zone_abr: string,
  alloc_af: number,
  primary_crop: string,
  legal_ac: number,
  carryover_af: number,
  coords: [number, number][],
  view_bound?: [number, number][],

}

export interface parcel_id_mapperType {
  [key: string]: ParcelDataType
}

export type ParcelDataListResponseType = {
  data: {
    parcel_table_data: ParcelDataType[];
    parcel_id_mapper: parcel_id_mapperType
  }

}

export interface AllocationChartDataType {
  remaining: number,
  allocation_used: number,
  full_label: string,
  category: string
}

export type AccountAllocationChartResponseType = {
  data: AllocationChartDataType[]
}

export interface AccountFarmUnitDataType {
  account_id: string,
  farm_unit_zone: string,
  fu_total_alloc_af: number,
  fu_sy_ac: number,
  fu_tw_ac: number,
  fu_alloc_af: number,
  fu_carryover_af: number,
  fu_total_adjustment_af: number,
  fu_etaw_af: number,
  fu_remain_af: number,
  remaining: number,
  farm_parcel_geojson: string,
  view_bounds: [number, number][]
}

export type AccountFarmUnitDataResponseType = {
  data: AccountFarmUnitDataType[]
}