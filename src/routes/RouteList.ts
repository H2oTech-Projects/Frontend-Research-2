import { lazy } from "react";
import * as routeUrl from "./RouteUrl";
import path from "path";

export const RouteList = [
  {
    path: routeUrl.Map?.url,
    name: routeUrl.Map?.name,
    Component: lazy(async () => await import("./../pages/Map")),
  },
  {
    path: routeUrl.Insight?.url,
    name: routeUrl.Insight?.name,
    Component: lazy(async () => await import("../pages/Insight")),
  },
  {
    path: routeUrl.Dashboard?.url,
    Component: lazy(async () => await import("../pages/Insight")),
  },
  {
    path: routeUrl.Field?.url,
    name: routeUrl.Field?.name,
    Component: lazy(
      async () => await import("../pages/management/land/field/Field")
    ),
  },
  {
    path: routeUrl.Parcel?.url,
    name: routeUrl.Parcel?.name,
    Component: lazy(
      async () => await import("../pages/management/land/parcel/Parcel")
    ),
  },
  {
    path: routeUrl.FieldMsmtPoint?.url,
    name:routeUrl.FieldMsmtPoint?.name,
    Component: lazy(
      async () => await import("../pages/management/water/fieldMsmtPoint/FieldMsmtPoint")
    ),
  },
  {
    path: routeUrl.AddField?.url,
    name: routeUrl.AddField?.name,
    Component: lazy(
      async () => await import("../pages/management/land/field/FieldForm")
    ),
  },
  {
    path: routeUrl.EditField?.url,
    name: routeUrl.EditField?.name,
    Component: lazy(
      async () => await import("../pages/management/land/field/FieldForm")
    ),
  },
  {
    path: routeUrl.ViewField?.url,
    name: routeUrl.ViewField?.name,
    Component: lazy(
      async () => await import("../pages/management/land/field/FieldForm")
    ),
  },
  {
    path: routeUrl.MeasurementPoint?.url,
    name: routeUrl.MeasurementPoint?.name,
    Component: lazy(
      async () =>
        await import(
          "./../pages/management/water/measurementPoint/MeasurementPoint"
        )
    ),
  },
  {
    path: routeUrl.EditMeasurementPoint?.url,
    name: routeUrl.EditMeasurementPoint?.name,
    Component: lazy(
      async () =>
        await import(
          "./../pages/management/water/measurementPoint/EditMeasurementPoint"
        )
    ),
  },
  {
    path: routeUrl.AddMeasurementPoint?.url,
    name: routeUrl.AddMeasurementPoint?.name,
    Component: lazy(
      async () =>
        await import(
          "./../pages/management/water/measurementPoint/AddMeasurementPoint"
        )
    ),
  },
  {
    path: routeUrl.District?.url,
    name: routeUrl.District?.name,
    Component: lazy(
      async () => await import("./../pages/management/water/district/District")
    ),
  },
  {
    path: routeUrl.AddDistrict?.url,
    name: routeUrl.AddDistrict?.name,
    Component: lazy(
      async () =>
        await import("./../pages/management/water/district/AddDistrict")
    ),
  },
  {
    path: routeUrl.EditDistrict?.url,
    name: routeUrl.EditDistrict?.name,
    Component: lazy(
      async () =>
        await import("./../pages/management/water/district/EditDistrict")
    ),
  },
  {
    path: routeUrl.Allocations?.url,
    name: routeUrl.Allocations?.name,
    Component: lazy(
      async () => await import("./../pages/management/Allocations")
    ),
  },
  {
    path: routeUrl.Crops?.url,
    name: routeUrl.Crops?.name,
    Component: lazy(async () => await import("../pages/management/crops/crops/index")),
  },
  {
    path: routeUrl.AddCrops?.url,
    name: routeUrl.AddCrops?.name,
    Component: lazy(async () => await import("../pages/management/crops/crops/CropForm")),
  },
  {
    path: routeUrl.EditCrops?.url,
    name: routeUrl.EditCrops?.name,
    Component: lazy(async () => await import("../pages/management/crops/crops/CropForm")),
  },
  {
    path: routeUrl.ViewCrops?.url,
    name: routeUrl.ViewCrops?.name,
    Component: lazy(async () => await import("../pages/management/crops/crops/CropForm")),
  },
  {
    path: routeUrl.Billings?.url,
    name: routeUrl.Billings?.name,
    Component: lazy(async () => await import("../pages/management/billing/Billings")),
  },
  {
    path: routeUrl.Customers?.url,
    name: routeUrl.Customers?.name,
    Component: lazy(
      async () => await import("../pages/management/customer/Customers")
    ),
  },
  {
    path: routeUrl.AddCustomers?.url,
    name: routeUrl.AddCustomers?.name,
    Component: lazy(
      async () => await import("../pages/management/customer/CustomerForm")
    ),
  },
  {
    path: routeUrl.EditCustomers?.url,
    name: routeUrl.EditCustomers?.name,
    Component: lazy(
      async () => await import("../pages/management/customer/CustomerForm")
    ),
  },
  {
    path: routeUrl.ViewCustomers?.url,
    name: routeUrl.ViewCustomers?.name,
    Component: lazy(
      async () => await import("../pages/management/customer/CustomerForm")
    ),
  },
  {
    path: routeUrl.CustomReport?.url,
    name: routeUrl.CustomReport?.name,
    Component: lazy(
      async () => await import("./../pages/report/CustomReports")
    ),
  },
  {
    path: routeUrl.DailyReport?.url,
    name: routeUrl.DailyReport?.name,
    Component: lazy(async () => await import("./../pages/report/DailyReports")),
  },
  {
    path: routeUrl.Help?.url,
    name: routeUrl.Help?.name,
    Component: lazy(async () => await import("./../pages/others/Help")),
  },
  {
    path: routeUrl.Settings?.url,
    name: routeUrl.Settings?.name,
    Component: lazy(async () => await import("./../pages/others/Settings")),
  },
  {
    path: routeUrl.Profile?.url,
    name: routeUrl.Profile?.name,
    Component: lazy(async () => await import("./../pages/others/Profile")),
  },
  {
    path: routeUrl.Canals?.url,
    name: routeUrl.Canals?.name,
    Component: lazy(async () => await import("./../pages/management/water/canals/Canals")),
  },
  {
    path: routeUrl.AddCanal?.url,
    name: routeUrl.AddCanal?.name,
    Component: lazy(async () => await import("./../pages/management/water/canals/CanalsForm")),
  },
  {
    path: routeUrl.EditCanal?.url,
    name: routeUrl.EditCanal?.name,
    Component: lazy(async () => await import("./../pages/management/water/canals/CanalsForm")),
  },
  {
    path: routeUrl.ViewCanal?.url,
    name: routeUrl.ViewCanal?.name,
    Component: lazy(async () => await import("./../pages/management/water/canals/CanalsForm")),
  },
  {
    path: routeUrl.Clients?.url,
    name: routeUrl.Clients?.name,
    Component: lazy(async () => await import("./../pages/management/clients/Clients")),
  },
  {
    path: routeUrl.AddClient?.url,
    name: routeUrl.AddClient?.name,
    Component: lazy(async () => await import("./../pages/management/clients/ClientForm")),
  },
  {
    path: routeUrl.EditClient?.url,
    name: routeUrl.EditClient?.name,
    Component: lazy(async () => await import("./../pages/management/clients/ClientForm")),
  },
  {
    path: routeUrl.ViewClient?.url,
    name: routeUrl.ViewClient?.name,
    Component: lazy(async () => await import("./../pages/management/clients/ClientForm")),
  },
  {
    path: routeUrl.AgencyInfo?.url,
    name: routeUrl.AgencyInfo?.name,
    Component: lazy(async () => import("./../pages/configuration/AgencyInfo")),
  },
  {
    path: routeUrl.DistrictInfo?.url,
    name: routeUrl.DistrictInfo?.name,
    Component: lazy(async () => import("./../pages/configuration/DistrictInfo")),
  },
  {
    path: routeUrl.CompanyInfo?.url,
    name: routeUrl.CompanyInfo?.name,
    Component: lazy(async () => import("./../pages/configuration/CompanyInfo")),
  },
  {
    path: routeUrl?.Time?.url,
    name: routeUrl?.Time?.name,
    Component: lazy(async () => import("./../pages/management/time/index"))
  },
  {
    path: routeUrl?.Conveyances?.url,
    name: routeUrl?.Conveyances?.name,
    Component: lazy(async () => import("./../pages/management/water/conveyances/index"))
  },
  {
    path: routeUrl?.AddConveyance?.url,
    name: routeUrl?.AddConveyance?.name,
    Component: lazy(async () => import("./../pages/management/water/conveyances/ConveyanceForm"))
  },
  {
    path: routeUrl?.EditConveyance?.url,
    name: routeUrl?.EditConveyance?.name,
    Component: lazy(async () => import("./../pages/management/water/conveyances/ConveyanceForm"))
  },
  {
    path: routeUrl?.CustomerField?.url,
    name: routeUrl?.CustomerField?.name,
    Component: lazy(async () => import("../pages/management/customer/customerField/customer-field"))
  },
  {
    path: routeUrl?.CustomerParcel?.url,
    name: routeUrl?.CustomerParcel?.name,
    Component: lazy(async () => import("../pages/management/customer/customerParcel/customer_parcel"))
  },
  {
    path: routeUrl?.AddCustomerField?.url,
    name: routeUrl?.AddCustomerField?.name,
    Component: lazy(async () => import("../pages/management/customer/customerField/formCustomerField"))
  },
  {
    path: routeUrl?.ViewCustomerField?.url,
    name: routeUrl?.ViewCustomerField?.name,
    Component: lazy(async () => import("../pages/management/customer/customerField/formCustomerField"))
  },
  {
    path: routeUrl?.EditCustomerField?.url,
    name: routeUrl?.EditCustomerField?.name,
    Component: lazy(async () => import("../pages/management/customer/customerField/formCustomerField"))
  },
  {
    path: routeUrl?.Region?.url,
    name: routeUrl?.Region?.name,
    Component: lazy(async () => import("./../pages/management/land/region/Region"))
  },
  {
    path: routeUrl?.SubRegion?.url,
    name: routeUrl?.SubRegion?.name,
    Component: lazy(async () => import("./../pages/management/land/subRegion/subRegion"))
  },
  {
    path: routeUrl?.FieldParcel?.url,
    name: routeUrl?.FieldParcel?.name,
    Component: lazy(async () => import("./../pages/management/land/field-parcel/index"))
  },
  {
    path: routeUrl?.ViewConveyance?.url,
    name: routeUrl?.ViewConveyance?.name,
    Component: lazy(async () => import("./../pages/management/water/conveyances/ConveyanceForm"))
  },
  {
    path: routeUrl?.CropField?.url,
    name: routeUrl?.CropField?.name,
    Component: lazy(async () => import("../pages/management/crops/cropFields/index"))
  }

];
