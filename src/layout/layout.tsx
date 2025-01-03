import { useMediaQuery } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../hooks/use-click-outside";
import { cn } from "../utils/cn";

import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ChevronsLeft } from "lucide-react";

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState<Boolean>(!isDesktopDevice);
    const [showHeader, setShowHeader] = useState<Boolean>(false);
    const sidebarRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

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

                <div className={cn("relative overflow-y-auto overflow-x-hidden", !showHeader ? "p-0" : "h-[calc(100vh-60px)] p-6")}>
                    <div
                        className={cn("absolute left-0 top-1/2 -translate-y-1/2 transform", showHeader ? "hidden" : "")}
                        style={{ zIndex: 800 }}
                    >
                        <button
                            className="m-2 size-10"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            <ChevronsLeft className={collapsed ? "rotate-180" : ""} />
                        </button>
                    </div>
                    <div className="max-h-screen">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
