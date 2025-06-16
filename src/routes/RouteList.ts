import { lazy } from "react";
import * as routeUrl from "./RouteUrl";
import path from "path";

export const RouteList = [
  {
    path: routeUrl.Map?.url,
    name:routeUrl.Map?.name,
    Component: lazy(async () => await import("./../pages/Map")),
  },
  {
    path: routeUrl.Insight?.url,
    name:routeUrl.Insight?.name,
    Component: lazy(async () => await import("../pages/Insight")),
  },
  {
    path: routeUrl.Dashboard?.url,
    Component: lazy(async () => await import("../pages/Insight")),
  },
  {
    path: routeUrl.Field?.url,
    name:routeUrl.Field?.name,
    Component: lazy(
      async () => await import("./../pages/management/water/field/Field")
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
    name:routeUrl.AddField?.name,
    Component: lazy(
      async () => await import("./../pages/management/water/field/AddField")
    ),
  },
  {
    path: routeUrl.EditField?.url,
    name:routeUrl.EditField?.name,
    Component: lazy(
      async () => await import("./../pages/management/water/field/EditField")
    ),
  },
  {
    path: routeUrl.MeasurementPoint?.url,
    name:routeUrl.MeasurementPoint?.name,
    Component: lazy(
      async () =>
        await import(
          "./../pages/management/water/measurementPoint/MeasurementPoint"
        )
    ),
  },
  {
    path: routeUrl.EditMeasurementPoint?.url,
    name:routeUrl.EditMeasurementPoint?.name,
    Component: lazy(
      async () =>
        await import(
          "./../pages/management/water/measurementPoint/EditMeasurementPoint"
        )
    ),
  },
  {
    path: routeUrl.AddMeasurementPoint?.url,
    name:routeUrl.AddMeasurementPoint?.name,
    Component: lazy(
      async () =>
        await import(
          "./../pages/management/water/measurementPoint/AddMeasurementPoint"
        )
    ),
  },
  {
    path: routeUrl.District?.url,
    name:routeUrl.District?.name,
    Component: lazy(
      async () => await import("./../pages/management/water/district/District")
    ),
  },
  {
    path: routeUrl.AddDistrict?.url,
    name:routeUrl.AddDistrict?.name,
    Component: lazy(
      async () =>
        await import("./../pages/management/water/district/AddDistrict")
    ),
  },
  {
    path: routeUrl.EditDistrict?.url,
    name:routeUrl.EditDistrict?.name,
    Component: lazy(
      async () =>
        await import("./../pages/management/water/district/EditDistrict")
    ),
  },
  {
    path: routeUrl.Allocations?.url,
    name:routeUrl.Allocations?.name,
    Component: lazy(
      async () => await import("./../pages/management/Allocations")
    ),
  },
  {
    path: routeUrl.Crops?.url,
    name:routeUrl.Crops?.name,
    Component: lazy(async () => await import("./../pages/management/Crops")),
  },
  {
    path: routeUrl.Billings?.url,
    name:routeUrl.Billings?.name,
    Component: lazy(async () => await import("./../pages/management/Billings")),
  },
  {
    path: routeUrl.Customers?.url,
    name:routeUrl.Customers?.name,
    Component: lazy(
      async () => await import("./../pages/management/Customers")
    ),
  },
  {
    path: routeUrl.CustomReport?.url,
    name:routeUrl.CustomReport?.name,
    Component: lazy(
      async () => await import("./../pages/report/CustomReports")
    ),
  },
  {
    path: routeUrl.DailyReport?.url,
    name:routeUrl.DailyReport?.name,
    Component: lazy(async () => await import("./../pages/report/DailyReports")),
  },
  {
    path: routeUrl.Help?.url,
    name:routeUrl.Help?.name,
    Component: lazy(async () => await import("./../pages/others/Help")),
  },
  {
    path: routeUrl.Settings?.url,
    name:routeUrl.Settings?.name,
    Component: lazy(async () => await import("./../pages/others/Settings")),
  },
  {
    path: routeUrl.Profile?.url,
    name:routeUrl.Profile?.name,
    Component: lazy(async () => await import("./../pages/others/Profile")),
  },
  {
    path: routeUrl.Canals?.url,
    name:routeUrl.Canals?.name,
    Component: lazy(async () => await import("./../pages/management/water/canals/Canals")),
  },
  {
    path: routeUrl.AddCanal?.url,
    name:routeUrl.AddCanal?.name,
    Component: lazy(async () => await import("./../pages/management/water/canals/CanalsForm")),
  },
  {
    path: routeUrl.EditCanal?.url,
    name:routeUrl.EditCanal?.name,
    Component: lazy(async () => await import("./../pages/management/water/canals/CanalsForm")),
  },
  {
    path: routeUrl.ViewCanal?.url,
    name:routeUrl.ViewCanal?.name,
    Component: lazy(async () => await import("./../pages/management/water/canals/CanalsForm")),
  },
  {
    path: routeUrl.Clients?.url,
    name:routeUrl.Clients?.name,
    Component: lazy(async () => await import("./../pages/management/clients/Clients")),
  },
  {
    path: routeUrl.AddClient?.url,
    name:routeUrl.AddClient?.name,
    Component: lazy(async () => await import("./../pages/management/clients/ClientForm")),
  },
  {
    path: routeUrl.EditClient?.url,
    name:routeUrl.EditClient?.name,
    Component: lazy(async () => await import("./../pages/management/clients/ClientForm")),
  },
  {
    path: routeUrl.ViewClient?.url,
    name:routeUrl.ViewClient?.name,
    Component: lazy(async () => await import("./../pages/management/clients/ClientForm")),
  },
  {
    path: routeUrl.AgencyInfo?.url,
    name:routeUrl.AgencyInfo?.name,
    Component: lazy(async () => import("./../pages/configuration/AgencyInfo")),
  },
  {
    path: routeUrl.DistrictInfo?.url,
    name:routeUrl.DistrictInfo?.name,
    Component: lazy(async () => import("./../pages/configuration/DistrictInfo")),
  },
  {
    path: routeUrl.CompanyInfo?.url,
    name:routeUrl.CompanyInfo?.name,
    Component: lazy(async () => import("./../pages/configuration/CompanyInfo")),
  },

];
