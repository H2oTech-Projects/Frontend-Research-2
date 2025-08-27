import { Bell, ChevronsLeft, Moon, Search, Sun, LogOut } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';
import profileImg from "../assets/profile-image.jpg";
import { logout } from "../redux/slice/authSlice";
import { useTheme } from "../hooks/useTheme";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { usePostLogoutUser } from "@/services/registration";
import { showErrorToast } from "@/utils/tools";
interface HeaderProps {
    collapsed: Boolean;
    setCollapsed: (collapsed: Boolean) => void;
}
export const Header = ({ collapsed, setCollapsed }: HeaderProps) => {
    const queryClient = useQueryClient();
    const { mutate, isPending, isError, error, isSuccess, data } = usePostLogoutUser();
    const refreshToken = useSelector((state: any) => state.auth.refresh);
    const Name = useSelector((state: any) => state.auth.user)?.split("@")?.[0];
    const { theme, setTheme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const handleCollapse = ()=> {
      setCollapsed(!collapsed);
      localStorage.setItem("isMenuCollapsed",JSON.stringify(!collapsed))
    };

    const handleLogout = () => {
      mutate({refresh_token: refreshToken},{
        onSuccess: (data) => {
          dispatch(logout());
          setIsModalOpen(false);
          toast.success("Logout successful.");
          queryClient.removeQueries();
        },
        onError: (err) => {
           showErrorToast(err?.response?.data.message)
        },

})
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
                    <span className="text-[16px] font-medium dark:text-slate-50">{Name === 'demo' ? "MADERA" : Name.toUpperCase()}</span>
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
                </div>
            )}
        </>
    );
};