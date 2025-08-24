import { url } from "inspector";

const Map = {
  url: "/map",
  name: "Map",
};

const Insight = {
  url: "/insight",
  name: "Insight",
};
const Dashboard = {
  url: "/dashboard",
  name: "Dashboard",
};

const Field = {
  url: "/fields",
  name: "Field",
};

const Parcel = {
  url: "/parcel",
  name: "Parcel",
};

const AddField = {
  url: "/field/addField",
  name: "AddField",
};

const EditField = {
  url: "/field/:id/edit/:wapId",
  name: "Edit Field",
};
const ViewField = {
    url: "/field/:id/view/:wapId",
    name: "View Field",
};

const MeasurementPoint = {
  url: "/measurementPoints",
  name: "MeasurementPoint",
};

const AddMeasurementPoint = {
  url: "/measurementPoint/addMeasurementPoint",
  name: "AddMeasurementPoint",
};

const EditMeasurementPoint = {
  url: "/measurementPoint/editMeasurementPoint",
  name: "EditMeasurementPoint",
};

const District = {
  url: "/district",
  name: "District",
};

const AddDistrict = {
  url: "/district/addDistrict",
  name: "AddDistrict",
};

const EditDistrict = {
  url: "/district/editDistrict",
  name: "EditDistrict",
};

const Customers = {
  url: "/customers",
  name: "Customers",
};
const Billings = {
  url: "/billings",
  name: "Billings",
};
const Allocations = {
  url: "/allocations",
  name: "Allocations",
};
const Crops = {
  url: "/crops",
  name: "Crops",
};
const CropField = {
  url: "/crop-fields",
  name: "Crop Fields",
};

const CustomReport = {
  url: "/customReport",
  name: "CustomReport",
};

const DailyReport = {
  url: "/dailyReport",
  name: "DailyReport",
};

const Settings = {
  url: "/settings",
  name: "Settings",
};

const Profile = {
  url: "/profile",
  name: "Profile",
};

const Help = {
  url: "/help",
  name: "Help",
};

const Canals = {
  url: "/canals",
  name: "Canals",
};

const AddCanal = {
  url: "/canals/addCanals",
  name: "AddCanal"
};

const EditCanal = {
  url: "/canals/:id/editCanal",
  name: "EditCanal"
};

const ViewCanal = {
  url: "/canals/:id/viewCanal",
  name: "ViewCanal"
};

const Clients = {
  url: "/clients",
  name: "Clients",
};

const AddClient = {
  url: "/clients/addClient",
  name: "AddClient",
};
const EditClient = {
  url: "/clients/:id/edit",
  name: "EditClient",
};
const ViewClient = {
  url: "/clients/:id/view",
  name: "ViewClient",
};

const AgencyInfo = {
  url: "/agencyInfo",
  name: "AgencyInfo",
};

const CompanyInfo = {
  url: "/companyInfo",
  name: "CompanyInfo",
};

const DistrictInfo = {
  url: "/districtInfo",
  name: "DistrictInfo",
};

const FieldMsmtPoint = {
  url: "/msmtPointsField",
  name: "Field-MsmtPoint",
};

const Time = {
  url: "/time",
  name: "Time"
}

const Conveyances = {
  url: "/conveyances",
  name: "Conveyances",
};

const AddConveyance = {
  url: "/conveyances/add",
  name: "AddConveyance",
};

const EditConveyance = {
  url: "/conveyances/:id/edit",
  name: "EditConveyance",
};

const CustomerField = {
  url: "/customer-field",
  name: "CustomerField",
}
const CustomerParcel = {
  url: "/customer-parcel",
  name: "CustomerParcel",
}
const AddCustomerField = {
  url: "/customer-field/add",
  name: "CustomerField",
}
const EditCustomerField = {
  url: "/customer-field/waps/:wapId/edit/:id",
  name: "CustomerField",
}
const ViewCustomerField = {
  url: "/customer-field/waps/:wapId/view/:id",
  name: "CustomerField",
}

const Region = {
  url: "/regions",
  name: "Region",
}

const SubRegion = {
  url: "/subregions",
  name: "Sub-Region",
};

const FieldParcel = {
  url: "/field-parcel",
  name: "Field-Parcel",
};

const ViewConveyance = {
  url: "/conveyances/:id/view",
  name: "ViewConveyance",
};

export {
  Map,
  Insight,
  Dashboard,
  Field,
  Parcel,
  FieldMsmtPoint,
  AddField,
  EditField,
  ViewField,
  MeasurementPoint,
  AddMeasurementPoint,
  EditMeasurementPoint,
  District,
  AddDistrict,
  EditDistrict,
  Customers,
  Billings,
  Allocations,
  Crops,
  CustomReport,
  DailyReport,
  Settings,
  Profile,
  Help,
  Canals,
  AddCanal,
  EditCanal,
  ViewCanal,
  Clients,
  AddClient,
  EditClient,
  ViewClient,
  AgencyInfo,
  CompanyInfo,
  DistrictInfo,
  Time,
  Conveyances,
  AddConveyance,
  EditConveyance,
  CustomerField,
  CustomerParcel,
  AddCustomerField,
  EditCustomerField,
  ViewCustomerField,
  Region,
  SubRegion,
  FieldParcel,
  ViewConveyance,
  CropField
};
