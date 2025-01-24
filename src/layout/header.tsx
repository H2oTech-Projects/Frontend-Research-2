import { Bell, ChevronsLeft, Moon, Search, Sun, LogOut } from "lucide-react";
import profileImg from "../assets/profile-image.jpg";
import { logout } from "../redux/slice/authSlice";
import { useTheme } from "../hooks/useTheme";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
interface HeaderProps {
    collapsed: Boolean;
    setCollapsed: (collapsed: Boolean) => void;
}
export const Header = ({ collapsed, setCollapsed }: HeaderProps) => {
    const { theme, setTheme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
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
            <header className="relative z-10 flex h-[40px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
                <div className="flex items-center gap-x-3">
                    <button
                        className="btn-ghost size-8"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <ChevronsLeft className={collapsed ? "rotate-180" : ""} />
                    </button>
                    <div className="input !h-6 w-60">
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
                    <button
                        className="btn-ghost size-10"
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
                    </button>
                    <button className="btn-ghost size-10">
                        <Bell size={16} />
                    </button>
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
                        onClick={() => {
                            dispatch(logout());
                            setIsModalOpen(false);
                            toast.success("Logout successful");
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            )}
        </>
    );
};
