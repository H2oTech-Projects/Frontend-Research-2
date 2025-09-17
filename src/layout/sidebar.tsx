import { forwardRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import * as Icon from "lucide-react";
import LightLogo from "../assets/Circular-Black.png";
import DarkLogo from "../assets/Circular-Light-Gray.png";
import * as routeUrl from "../routes/RouteUrl";
import { cn } from "../utils/cn";
import { staticPermissionList } from "@/utils/testPermission";
import { useSelector } from "react-redux";

const menuLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Map",
        icon: Icon.Map,
        name: routeUrl?.Map?.name,
        path: routeUrl?.Map?.url,
        type: "link",
        Children: [],
      },
      {
        label: "Allocation",
        icon: Icon.ChartColumnBig,
        name: routeUrl?.Insight?.name,
        path: routeUrl?.Insight?.url,
        type: "link",
        Children: [],
      },
      {
        label: "Collect",
        icon: Icon.CloudUpload,
        name: routeUrl?.Collect?.name,
        path: routeUrl?.Collect?.url,
        type: "link",
        Children: [],
      }
    ],
  },
  {
    title: "Management",
    links: [

      {
        label: "Time",
        icon: Icon.Clock11,
        path: routeUrl?.Time?.url,
        name: routeUrl?.Time?.name,
        type: "link",
        Children: [],
      },
      {
        label: "Land",
        icon: Icon.LandPlot,
        path: null,
        type: "group",
        Children: [
          { label: "Fields", path: routeUrl?.Field?.url, name: routeUrl?.Field?.name },
          // { label: "Field-MsmtPoint", path: routeUrl?.FieldMsmtPoint?.url, name: routeUrl?.FieldMsmtPoint?.name },
          { label: "Parcels", path: routeUrl?.Parcel?.url, name: routeUrl?.Parcel?.name },
          { label: "Subregions", path: routeUrl?.SubRegion?.url, name: routeUrl?.SubRegion?.name },
          { label: "Regions", path: routeUrl?.Region?.url, name: routeUrl?.Region?.name },
        ],
      },
      {
        label: "Water",
        icon: Icon.Droplet,
        path: null,
        type: "group",
        Children: [
          { label: "Measurement Points", path: routeUrl?.MeasurementPoint?.url, name: routeUrl?.MeasurementPoint?.name },
          // { label: "Fields", path: routeUrl?.Field?.url, name: routeUrl?.Field?.name },
          { label: "Msmt Point-Field", path: routeUrl?.FieldMsmtPoint?.url, name: routeUrl?.FieldMsmtPoint?.name },
          { label: "Conveyances", path: routeUrl?.Conveyances?.url, name: routeUrl?.Conveyances?.name },
          // { label: "Districts", path: routeUrl?.District?.url, name: routeUrl?.District?.name },
        ],
      },
      {
        label: "Customers",
        icon: Icon.Users,
        path: null,
        type: "group",
        Children: [
          { label: "Customers", path: routeUrl?.Customers?.url, name: routeUrl?.Customers?.name },
          { label: "Customer-Field", path: routeUrl?.CustomerField?.url, name: routeUrl?.CustomerField?.name },
          { label: "Customer-Parcel", path: routeUrl?.CustomerParcel?.url, name: routeUrl?.CustomerParcel?.name }],
      },
      {
        label: "Crops",
        icon: Icon.Sprout,
        path: null,
        type: "group",
        Children: [
          { label: "Crops", path: routeUrl?.Crops?.url, name: routeUrl?.Crops?.name },
          { label: "Crop-Field", path: routeUrl?.CropField?.url, name: routeUrl?.CropField?.name }],
      },
      {
        label: "Billing",
        icon: Icon.ReceiptText,
        name: routeUrl?.Billings?.name,
        path: routeUrl?.Billings?.url,
        type: "link",
        Children: [],
      },
      // {
      //   label: "Crops",
      //   icon: Icon.Sprout,
      //   name: routeUrl?.Crops?.name,
      //   path: routeUrl?.Crops?.url,
      //   type: "link",
      //   Children: [],
      // },
      // {
      //   label: "Clients",
      //   icon: Icon.Users,
      //   name: routeUrl?.Clients?.name,
      //   path: routeUrl?.Clients?.url,
      //   type: "link",
      // },


    ],
  },
  {

    title: "Configuration",
    links: [
      {
        label: "Agency Information",
        icon: Icon.Building,
        path: routeUrl?.AgencyInfo?.url,
        name: routeUrl?.AgencyInfo?.name,
        type: "link",
        Children: [],
      },
            {
        label: "Allocation",
        icon: Icon.ChartColumnBig,
        name: routeUrl?.Allocations?.name,
        path: routeUrl?.Allocations?.url,
        type: "link",
      },
      // {
      //   label: "Company Information",
      //   icon: Icon.Building2,
      //   path: "/companyInfo",
      //   type: "link",
      //   Children: [],
      // },
      // {
      //   label: "Districts Information",
      //   icon: Icon.LandPlot,
      //   path: "/districtInfo",
      //   type: "link",
      //   Children: [],
      // },

    ]
  },

  {
    title: "Reports",
    links: [
      {
        label: "Custom Reports",
        icon: Icon.BookOpenText,
        name: routeUrl?.CustomReport?.name,
        path: routeUrl?.CustomReport?.url,
        type: "link",
        Children: [],
      },
      {
        label: "Daily Reports",
        icon: Icon.BookText,
        name: routeUrl?.DailyReport?.name,
        path: routeUrl?.DailyReport?.url,
        type: "link",
        Children: [],
      },
    ],
  },
  {
    title: "Others",
    links: [
      {
        label: "Settings",
        icon: Icon.Settings,
        name: routeUrl?.Settings?.name,
        path: routeUrl?.Settings?.url,
        type: "link",
        Children: [],
      },
      {
        label: "Profile",
        icon: Icon.User,
        name: routeUrl?.Profile?.name,
        path: routeUrl?.Profile?.url,
        type: "link",
        Children: [],
      },
    ],
  },
];



export const Sidebar = forwardRef(({ collapsed, setCollapsed }: any, ref) => {
const UserRole = useSelector((state: any) => state.auth?.userRole);
const permissionList =  staticPermissionList(UserRole);
const filteredMenuLinks = menuLinks
  .map((section) => {
    const filteredLinks = section.links
      .map((link) => {
        // If it's a group with Children (nested routes)
        if (link.type === "group" && Array.isArray(link.Children)) {
          const filteredChildren = link.Children.filter((child) =>
            permissionList.includes(child.name)
          );
          return filteredChildren.length
            ? { ...link, Children: filteredChildren }
            : null;
        }

        // For normal link items
        return permissionList.includes(link.name!) ? link : null;
      })
      .filter(Boolean); // Remove nulls

    return filteredLinks.length
      ? { ...section, links: filteredLinks }
      : null;
  })
  .filter(Boolean);
  const handleCollapse = () => {
    setCollapsed(false);
    localStorage.setItem("isMenuCollapsed", JSON.stringify(false))
  };
  const route = window.location.pathname;
  const initialChildMenu = {
    parentName: "",
    showChildren: false,
  };
  const [activeLinkGroup, setActiveLinkGroup] = useState("");
  const [childMenu, setChildMenu] = useState(initialChildMenu);
  const SetActiveLinkGroup = (LinkGroup: string, path: string) => {
    const ActiveLinkGroupDetail = {
      linkGroup: LinkGroup,
      path: path,
    };
    setActiveLinkGroup(LinkGroup);
    localStorage.setItem("ActiveLinkGroup", JSON.stringify(ActiveLinkGroupDetail));
  };
  const ResetActiveLinkGroup = () => {
    setActiveLinkGroup("");
    setChildMenu(initialChildMenu);
    localStorage.removeItem("ActiveLinkGroup");
  };
  const DisplaySubmenu = (parentName: string, show: boolean) => {
    setChildMenu({ parentName: parentName, showChildren: collapsed ? true : childMenu?.parentName === parentName ? !show : show });
    collapsed && handleCollapse();
  };
  useEffect(() => {
    if (collapsed) {
      setChildMenu({ ...childMenu, showChildren: false });
    }
  }, [collapsed]);
  useEffect(() => {
    const activeLinkGroup = JSON.parse(localStorage.getItem("ActiveLinkGroup") || "{}");
    if (route.includes(activeLinkGroup?.path)) {
      setActiveLinkGroup(activeLinkGroup?.linkGroup);
      setChildMenu({ parentName: activeLinkGroup?.linkGroup, showChildren: true });
    }
  }, []);
  return (
    <aside
      ref={ref as React.LegacyRef<HTMLElement>}
      className={cn(
        "fixed z-[9000] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0",
      )}
    >
      <div className="flex items-center gap-x-3 px-3 py-2">
        <img
          src={LightLogo}
          alt="Flow"
          className="h-[32px] w-[32px] dark:hidden"
        />
        <img
          src={DarkLogo}
          alt="Flow"
          className="hidden h-[32px] w-[32px] dark:block"
        />

        {!collapsed && <p className="animate-slideIn text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">FLOW</p>}
      </div>
      <div className="flex w-full animate-slideIn flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-2 [scrollbar-width:_thin]">
        {filteredMenuLinks.map((navbarLink) => (
        navbarLink?.title &&  <nav
            key={navbarLink.title}
            className={cn("sidebar-group", collapsed && "md:items-center", "animate-slideIn")}
          >
            <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
            {navbarLink.links.map((link:any) =>
            link.type === "link" && link.path !== null  ? (
              <NavLink
                  key={link.label}
                  to={link?.path}
                  className={cn("sidebar-item", collapsed && "md:w-[45px]", "animate-slideIn")}
                  onClick={ResetActiveLinkGroup}
                >
                  <link.icon
                    size={22}
                    className="flex-shrink-0"
                  />
                  {!collapsed && <p className="animate-slideIn whitespace-nowrap">{link.label}</p>}
                </NavLink>
              ) : (
                <div
                  className="flex-col"
                  key={link.label}
                >
                  <button
                    className={cn(
                      childMenu.parentName === link.label && childMenu.showChildren
                        ? "sidebar-menuName-active"
                        : activeLinkGroup === link.label
                          ? "sidebar-menuName-activeLink"
                          : "sidebar-menuName",
                      "animate-slideIn",
                      collapsed && "md:w-[45px]",
                    )}
                    onClick={() =>
                      DisplaySubmenu(link.label, childMenu.parentName === link.label ? childMenu.showChildren : true)
                    }
                  >
                    <link.icon
                      size={22}
                      className="flex-shrink-0"
                    />
                    {!collapsed && <p className="animate-slideIn whitespace-nowrap">{link.label}</p>}
                    <div className="flex grow justify-end">
                      <Icon.ChevronDown
                        size={16}
                        className={cn(
                          "flex-shrink-0",
                          collapsed && "hidden",
                          "animate-slideIn",
                          childMenu.parentName === link.label && childMenu.showChildren ? "rotate-180" : "",
                        )}
                      />
                    </div>
                  </button>

                  {childMenu.parentName === link.label && childMenu.showChildren && (
                    <div className={cn("menu-dropDown", "animate-fadeIn", collapsed && "hidden")}>
                      {link?.Children &&
                        link?.Children.map((child:any) => (
                        <NavLink
                            onClick={() => SetActiveLinkGroup(link.label, child.path)}
                            key={child?.label}
                            to={child?.path}
                            className={cn("sidebar-item", collapsed && "md:w-[45px]", "animate-fadeIn")}
                          >
                            {child?.label}
                          </NavLink>
                        ))}
                    </div>
                  )}
                </div>
              ),
            )}
          </nav>
        ))}
      </div>
    </aside>
  );
});


// export const Sidebar = forwardRef(({ collapsed, setCollapsed }: any, ref) => {
//   const handleCollapse = () => {
//     setCollapsed(false);
//     localStorage.setItem("isMenuCollapsed", JSON.stringify(false))
//   };
//   const route = window.location.pathname;
//   const initialChildMenu = {
//     parentName: "",
//     showChildren: false,
//   };
//   const [activeLinkGroup, setActiveLinkGroup] = useState("");
//   const [childMenu, setChildMenu] = useState(initialChildMenu);
//   const SetActiveLinkGroup = (LinkGroup: string, path: string) => {
//     const ActiveLinkGroupDetail = {
//       linkGroup: LinkGroup,
//       path: path,
//     };
//     setActiveLinkGroup(LinkGroup);
//     localStorage.setItem("ActiveLinkGroup", JSON.stringify(ActiveLinkGroupDetail));
//   };
//   const ResetActiveLinkGroup = () => {
//     setActiveLinkGroup("");
//     setChildMenu(initialChildMenu);
//     localStorage.removeItem("ActiveLinkGroup");
//   };
//   const DisplaySubmenu = (parentName: string, show: boolean) => {
//     setChildMenu({ parentName: parentName, showChildren: collapsed ? true : childMenu?.parentName === parentName ? !show : show });
//     collapsed && handleCollapse();
//   };
//   useEffect(() => {
//     if (collapsed) {
//       setChildMenu({ ...childMenu, showChildren: false });
//     }
//   }, [collapsed]);
//   useEffect(() => {
//     const activeLinkGroup = JSON.parse(localStorage.getItem("ActiveLinkGroup") || "{}");
//     if (route.includes(activeLinkGroup?.path)) {
//       setActiveLinkGroup(activeLinkGroup?.linkGroup);
//       setChildMenu({ parentName: activeLinkGroup?.linkGroup, showChildren: true });
//     }
//   }, []);
//   return (
//     <aside
//       ref={ref as React.LegacyRef<HTMLElement>}
//       className={cn(
//         "fixed z-[9000] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
//         collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
//         collapsed ? "max-md:-left-full" : "max-md:left-0",
//       )}
//     >
//       <div className="flex items-center gap-x-3 px-3 py-2">
//         <img
//           src={LightLogo}
//           alt="Flow"
//           className="h-[32px] w-[32px] dark:hidden"
//         />
//         <img
//           src={DarkLogo}
//           alt="Flow"
//           className="hidden h-[32px] w-[32px] dark:block"
//         />

//         {!collapsed && <p className="animate-slideIn text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">FLOW</p>}
//       </div>
//       <div className="flex w-full animate-slideIn flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-2 [scrollbar-width:_thin]">
//         {menuLinks.map((navbarLink) => (
//           <nav
//             key={navbarLink.title}
//             className={cn("sidebar-group", collapsed && "md:items-center", "animate-slideIn")}
//           >
//             <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
//             {navbarLink.links.map((link) =>
//               link.type === "link" && link.path !== null ? (
//                 <NavLink
//                   key={link.label}
//                   to={link?.path}
//                   className={cn("sidebar-item", collapsed && "md:w-[45px]", "animate-slideIn")}
//                   onClick={ResetActiveLinkGroup}
//                 >
//                   <link.icon
//                     size={22}
//                     className="flex-shrink-0"
//                   />
//                   {!collapsed && <p className="animate-slideIn whitespace-nowrap">{link.label}</p>}
//                 </NavLink>
//               ) : (
//                 <div
//                   className="flex-col"
//                   key={link.label}
//                 >
//                   <button
//                     className={cn(
//                       childMenu.parentName === link.label && childMenu.showChildren
//                         ? "sidebar-menuName-active"
//                         : activeLinkGroup === link.label
//                           ? "sidebar-menuName-activeLink"
//                           : "sidebar-menuName",
//                       "animate-slideIn",
//                       collapsed && "md:w-[45px]",
//                     )}
//                     onClick={() =>
//                       DisplaySubmenu(link.label, childMenu.parentName === link.label ? childMenu.showChildren : true)
//                     }
//                   >
//                     <link.icon
//                       size={22}
//                       className="flex-shrink-0"
//                     />
//                     {!collapsed && <p className="animate-slideIn whitespace-nowrap">{link.label}</p>}
//                     <div className="flex grow justify-end">
//                       <Icon.ChevronDown
//                         size={16}
//                         className={cn(
//                           "flex-shrink-0",
//                           collapsed && "hidden",
//                           "animate-slideIn",
//                           childMenu.parentName === link.label && childMenu.showChildren ? "rotate-180" : "",
//                         )}
//                       />
//                     </div>
//                   </button>

//                   {childMenu.parentName === link.label && childMenu.showChildren && (
//                     <div className={cn("menu-dropDown", "animate-fadeIn", collapsed && "hidden")}>
//                       {link?.Children &&
//                         link?.Children.map((child) => (
//                           <NavLink
//                             onClick={() => SetActiveLinkGroup(link.label, child.path)}
//                             key={child?.label}
//                             to={child?.path}
//                             className={cn("sidebar-item", collapsed && "md:w-[45px]", "animate-fadeIn")}
//                           >
//                             {child?.label}
//                           </NavLink>
//                         ))}
//                     </div>
//                   )}
//                 </div>
//               ),
//             )}
//           </nav>
//         ))}
//       </div>
//     </aside>
//   );
// });

