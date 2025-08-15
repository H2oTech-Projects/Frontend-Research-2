import { Bell, ChevronsLeft, Moon, Search, Sun, LogOut } from "lucide-react";
import profileImg from "../assets/profile-image.jpg";
import { logout } from "../redux/slice/authSlice";
import { useTheme } from "../hooks/useTheme";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { usePostLogoutUser, usePostAssociateUserClient } from "@/services/registration";
import { showErrorToast } from "@/utils/tools";
import * as routeUrl from "../routes/RouteUrl";
import { cn } from "../utils/cn";
import { icon } from "leaflet";
import * as Icon from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
    collapsed: Boolean;
    setCollapsed: (collapsed: Boolean) => void;
}
const menuLinks = [
  {
    title: "",
    links: [
      {
        label: "Switch Client",
        icon: Icon.LandPlot,
        path: null,
        type: "group",
        Children: [
          { label: "SWMCss", value: '1' },
          { label: "Colusssa", value: '2' },
          { label: "Maderssa", value:'3' },
        ],
      },
    ],
  }
];
export const Header = ({ collapsed, setCollapsed }: HeaderProps) => {
    const navigate = useNavigate();
    const { mutate, isPending, isError, error, isSuccess, data } = usePostLogoutUser();
    const { mutate: associateClient, isPending: associating} = usePostAssociateUserClient();
     const refreshToken = useSelector((state: any) => state.auth.refresh);
    const { theme, setTheme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const initialChildMenu = {
      parentName: "",
      showChildren: false,
    };
    const [childMenu, setChildMenu] = useState(initialChildMenu);
    const [activeLinkGroup, setActiveLinkGroup] = useState("Time");
    const associableClients = JSON.parse(localStorage.getItem("auth")|| "").associable_clients;
    menuLinks[0].links[0].Children = associableClients;
    const handleCollapse = ()=> {
      setCollapsed(!collapsed);
      localStorage.setItem("isMenuCollapsed",JSON.stringify(!collapsed))
    };
    const DisplaySubmenu = (parentName: string, show: boolean) => {
      setChildMenu({ parentName: parentName, showChildren: collapsed ? true : childMenu?.parentName === parentName ? !show : show });
      collapsed && handleCollapse();
    };

    const handleLogout = () => {
      mutate({refresh_token: refreshToken},{
        onSuccess: (data) => {
          dispatch(logout());
          setIsModalOpen(false);
          toast.success("Logout successful");
        },
        onError: (err) => {
           showErrorToast(err?.response?.data.message)
        },

      })
    }

    const switchClient = () => {
      if (associableClients.length < 2) return <></>;
      return menuLinks.map((navbarLink: any) => (
        <nav
          key={navbarLink.title}
          className={cn("sidebar-group", collapsed && "md:items-center", "")}
        >
          <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
          {navbarLink.links.map((link: any) =>
            link.type === "link" && link.path !== null ? (
              <NavLink
                key={link.label}
                to={link?.path}
                className={cn("sidebar-item", collapsed && "md:w-[45px]", "")}
                //onClick={ResetActiveLinkGroup}
              >
                <link.icon
                  size={22}
                  className="flex-shrink-0"
                />
                {!collapsed && <p className=" whitespace-nowrap">{link.label}</p>}
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
                    "",
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
                  {!collapsed && <p className=" whitespace-nowrap">{link.label}</p>}
                  <div className="flex grow justify-end">
                    <Icon.ChevronDown
                      size={16}
                      className={cn(
                        "flex-shrink-0",
                        collapsed && "hidden",
                        "",
                        childMenu.parentName === link.label && childMenu.showChildren ? "rotate-180" : "",
                      )}
                    />
                  </div>
                </button>

                {childMenu.parentName === link.label && childMenu.showChildren && (
                  <div className={cn("menu-dropDown", "animate-fadeIn", collapsed && "hidden")}>
                    {link?.Children &&
                      link?.Children.map((child: any) => (
                        <p
                          onClick={() => {associateClientUser(child?.value)}}
                          className={cn("sidebar-item", collapsed && "md:w-[45px]", "animate-fadeIn")}
                        >
                          {child?.label}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            ),
          )}
        </nav>
      ))
    }
    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const associateClientUser = (id: any)=> {
      associateClient(id, {
        onSuccess: (data: any) => {
          toast.success(data?.message);
          navigate("/map");
        },
        onError: (error) => {
          showErrorToast("Failed to associate.");
        },
      });
    }
    return (
        <>
            <header className="relative z-10 flex h-[48px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
                <div className="flex items-center gap-x-3">
                    {/* <button
                        className="btn-ghost size-8 bg-royalBlue text-slate-50 dark:bg-royalBlue dark:text-slate-50  "
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <ChevronsLeft className={collapsed ? "rotate-180" : ""} />
                    </button> */}
                    <Button
                        variant={"default"}
                        className="h-8 !w-6"
                        onClick={() => handleCollapse()}
                    >
                        <ChevronsLeft className={collapsed ? "rotate-180" : ""} />
                    </Button>
                    <div className="input !h-7 w-60">
                        <Search
                            size={16}
                            className="text-slate-300"
                        />
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search..."
                            className="w-full bg-transparent text-xs text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-x-3">
                    <Button
                        variant={"default"}
                        className="dark:bg-royalBlue h-8 !w-6"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    >
                        <Sun
                            size={16}
                            className="dark:hidden"
                        />
                        <Moon
                            size={16}
                            className="hidden dark:block"
                        />
                    </Button>
                    <Button variant={"default"} className="dark:bg-royalBlue h-8 !w-6">
                        <Bell size={16} />
                    </Button>
                    <button
                        className="size-8 overflow-hidden rounded-full"
                        onClick={() => setIsModalOpen(!isModalOpen)}
                    >
                        <img
                            src={profileImg}
                            alt="profile image"
                            className="size-full object-cover"
                        />
                    </button>
                </div>
            </header>
            {isModalOpen && (
                <div
                    ref={modalRef}
                    className="absolute right-3 top-9 z-50 mt-2 flex w-52 flex-col gap-1 rounded-xl border-slate-900 bg-white p-1 shadow-lg dark:bg-slate-900 dark:text-slate-50"
                >
                    <button
                        className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-950"
                        disabled={isPending}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                    {switchClient()}
                </div>
            )}
        </>
    );
};