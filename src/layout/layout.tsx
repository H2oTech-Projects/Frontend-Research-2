import { useMediaQuery } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../hooks/use-click-outside";
import { cn } from "../utils/cn";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ChevronsLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setSideMenuCollapse } from "@/redux/slice/menuCollapse";
import { useDispatch } from "react-redux";
import { json } from "stream/consumers";
const Layout = () => {
    const dispatch = useDispatch();
    const isCollapse = JSON.parse(localStorage.getItem("isMenuCollapsed") as string)
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState<Boolean>(!isDesktopDevice);
    const [showHeader, setShowHeader] = useState<Boolean>(false);
    const sidebarRef = useRef(null);
    const location = useLocation();
    const handleCollapse = ()=> {
      setCollapsed(!collapsed);
      localStorage.setItem("isMenuCollapsed",JSON.stringify(!collapsed))
};

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
        // localStorage.setItem("isMenuCollapsed",JSON.stringify(!isDesktopDevice))      
    }, [isDesktopDevice]);
    useEffect(() => {
        dispatch(setSideMenuCollapse(collapsed ? true : false));
    }, [collapsed])

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    useEffect(() => {
        if (location.pathname === "/map") {
            setShowHeader(false);
        } else setShowHeader(true);
    }, [location.pathname]);
    useEffect(()=>{setCollapsed(isCollapse)},[])
    return (
        <div className="min-h-screen bg-slateLight-100 transition-colors dark:bg-slateLight-950">
            {/* <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    !collapsed ? "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30" : "",
                )}
            /> */}
            <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                {showHeader && (
                    <Header
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />
                )}

                <div className={cn("relative overflow-y-auto overflow-x-hidden", !showHeader ? "p-0" : "h-[calc(100vh-60px)]")}>
                    <div className={cn("absolute left-2 top-1/2 z-[800] -translate-y-1/2 transform", showHeader ? "hidden" : "")}>
                        {/* <button
                            className="btn-map m-2 size-10"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            <ChevronsLeft
                                className={collapsed ? "rotate-180" : ""}
                                size={32}
                            />
                        </button> */}
                        <Button
                            variant={"default"}
                            className="size-8"
                            onClick={handleCollapse}
                        >
                            <ChevronsLeft
                                className={collapsed ? "rotate-180" : ""}
                                size={20}
                            />
                        </Button>
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
