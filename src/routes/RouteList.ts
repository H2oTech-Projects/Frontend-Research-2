import { lazy } from "react";
import * as routeUrl from "./RouteUrl";

export const RouteList = [
  {
    path: routeUrl.Map?.url,
    Component: lazy(async () => await import("./../pages/Map")),
  },
  {
    path: routeUrl.Insight?.url,
    Component: lazy(async () => await import("./../pages/Insight")),
  },
  {
    path: routeUrl.Field?.url,
    Component: lazy(
      async () => await import("./../pages/management/water/field/Field")
    ),
  },
  {
    path: routeUrl.AddField?.url,
    Component: lazy(
      async () => await import("./../pages/management/water/field/AddField")
    ),
  },
  {
    path: routeUrl.EditField?.url,
    Component: lazy(
      async () => await import("./../pages/management/water/field/EditField")
    ),
  },
  {
    path: routeUrl.MeasurementPoint?.url,
    Component: lazy(
      async () =>
        await import(
          "./../pages/management/water/measurementPoint/MeasurementPoint"
        )
    ),
  },
  {
    path: routeUrl.EditMeasurementPoint?.url,
    Component: lazy(
      async () =>
        await import(
          "./../pages/management/water/measurementPoint/EditMeasurementPoint"
        )
    ),
  },
  {
    path: routeUrl.AddMeasurementPoint?.url,
    Component: lazy(
      async () =>
        await import(
          "./../pages/management/water/measurementPoint/AddMeasurementPoint"
        )
    ),
  },
  {
    path: routeUrl.District?.url,
    Component: lazy(
      async () => await import("./../pages/management/water/district/District")
    ),
  },
  {
    path: routeUrl.AddDistrict?.url,
    Component: lazy(
      async () =>
        await import("./../pages/management/water/district/AddDistrict")
    ),
  },
  {
    path: routeUrl.EditDistrict?.url,
    Component: lazy(
      async () =>
        await import("./../pages/management/water/district/EditDistrict")
    ),
  },
  {
    path: routeUrl.Allocations?.url,
    Component: lazy(
      async () => await import("./../pages/management/Allocations")
    ),
  },
  {
    path: routeUrl.Crops?.url,
    Component: lazy(async () => await import("./../pages/management/Crops")),
  },
  {
    path: routeUrl.Billings?.url,
    Component: lazy(async () => await import("./../pages/management/Billings")),
  },
  {
    path: routeUrl.Customers?.url,
    Component: lazy(
      async () => await import("./../pages/management/Customers")
    ),
  },
  {
    path: routeUrl.CustomReport?.url,
    Component: lazy(
      async () => await import("./../pages/report/CustomReports")
    ),
  },
  {
    path: routeUrl.DailyReport?.url,
    Component: lazy(async () => await import("./../pages/report/DailyReports")),
  },
  {
    path: routeUrl.Help?.url,
    Component: lazy(async () => await import("./../pages/others/Help")),
  },
  {
    path: routeUrl.Settings?.url,
    Component: lazy(async () => await import("./../pages/others/Settings")),
  },
  {
    path: routeUrl.Profile?.url,
    Component: lazy(async () => await import("./../pages/others/Profile")),
  },
];
