import { forwardRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";
import * as Icon from "lucide-react";
import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets//logo-dark.svg";

import { cn } from "../utils/cn";
const menuLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Map",
                icon: Icon.Map,
                path: "/map",
                type: "link",
                Children: [],
            },
            {
                label: "Insights",
                icon: Icon.LayoutDashboard,
                path: "/insight",
                type: "link",
                Children: [],
            },
        ],
    },
    {
        title: "Management",
        links: [
            {
                label: "Allocations",
                icon: Icon.ChartColumnBig,
                path: "/allocations",
                type: "link",
            },
            {
                label: "Billings",
                icon: Icon.ReceiptText,
                path: "/billings",
                type: "link",
                Children: [],
            },
            {
                label: "Crops",
                icon: Icon.Sprout,
                path: "/crops",
                type: "link",
                Children: [],
            },
            {
                label: "Customers",
                icon: Icon.Users,
                path: "/customers",
                type: "link",
                Children: [],
            },
            {
                label: "Water",
                icon: Icon.Droplet,
                path: null,
                type: "group",
                Children: [
                    { label: "Measurement Point", path: "/measurementPoint" },
                    { label: "Field", path: "/field" },
                    { label: "District", path: "/district" },
                ],
            },
            // {
            //     label: "Fire",
            //     icon: Icon.Fan,
            //     path: null,
            //     type: "group",
            //     Children: [
            //         { label: "Settings", path: "/settings" },
            //         { label: "Profile", path: "/profile" },
            //     ],
            // },
        ],
    },
    {
        title: "Reports",
        links: [
            {
                label: "Custom Reports",
                icon: Icon.BookOpenText,
                path: "/customReport",
                type: "link",
                Children: [],
            },
            {
                label: "Daily Reports",
                icon: Icon.BookText,
                path: "/dailyReport",
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
                path: "/settings",
                type: "link",
                Children: [],
            },
            {
                label: "Profile",
                icon: Icon.User,
                path: "/profile",
                type: "link",
                Children: [],
            },
        ],
    },
];
export const Sidebar = forwardRef(({ collapsed, setCollapsed }: any, ref) => {
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
        collapsed && setCollapsed(false);
    };
    useEffect(() => {
        if (collapsed) {
            setChildMenu({ ...childMenu, showChildren: false });
        }
    }, [collapsed]);
    useEffect(() => {
        const activeLinkGroup = JSON.parse(localStorage.getItem("ActiveLinkGroup") || "{}");
        if (route.includes(activeLinkGroup?.path)) {
            console.log("here");
            setActiveLinkGroup(activeLinkGroup?.linkGroup);
            setChildMenu({ parentName: activeLinkGroup?.linkGroup, showChildren: true });
        }
    }, []);
    return (
        <aside
            ref={ref as React.LegacyRef<HTMLElement>}
            className={cn(
                "fixed z-[10000] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex gap-x-3 p-3">
                <img
                    src={logoLight}
                    alt="Logoipsum"
                    className="dark:hidden"
                />
                <img
                    src={logoDark}
                    alt="Logoipsum"
                    className="hidden dark:block"
                />
                {!collapsed && <p className="animate-slideIn text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">Flow</p>}
            </div>
            <div className="flex w-full animate-slideIn flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {menuLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center", "animate-slideIn")}
                    >
                        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
                        {navbarLink.links.map((link) =>
                            link.type === "link" && link.path !== null ? (
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
                                                link?.Children.map((child) => (
                                                    <NavLink
                                                        onClick={() => SetActiveLinkGroup(link.label, child.path)}
                                                        key={child.label}
                                                        to={child.path}
                                                        className={cn("sidebar-item", collapsed && "md:w-[45px]", "animate-fadeIn")}
                                                    >
                                                        {child.label}
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
