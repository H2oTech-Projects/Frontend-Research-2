import EarthLightLogo from "../assets/earth-dark.svg";
import H2OLogo from "../assets/logo.png";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "../utils/cn";
const AuthenticationCard = ({ Form, title }: { Form: React.ReactNode; title: string }) => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    return (
        <div
            className={cn(
                "flex content-center items-center justify-center bg-slateLight-100 transition-colors dark:bg-slateLight-950",
                isDesktopDevice ? "min-h-screen" : "h-screen",
            )}
        >
            <div
                className={cn(
                    "relative flex overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slateLight-800",
                    isDesktopDevice ? "h-[420px] w-[760px]" : "flex h-[660px] w-11/12 flex-col",
                )}
            >
                <div className={cn("flex flex-col items-center gap-3 bg-royalBlue p-5", isDesktopDevice ? "w-1/2" : "h-1/2")}>
                    <h1 className={cn("font-bold text-white", isDesktopDevice ? "m-4 text-5xl" : "m-2 text-4xl")}>Flow</h1>
                    <h3 className={cn("font-thin text-slate-300", isDesktopDevice ? "m-3 text-2xl" : "m-1 text-xl")}>Water Accounting Application</h3>
                    <div className="flex flex-col items-center">
                        <p className="text-base font-thin text-slate-300">Data from all your fields in one </p>
                        <p className="text-base font-thin text-slate-300">easy to access spot.</p>
                    </div>
                    <div className={cn("flex flex-col items-center gap-3", isDesktopDevice ? "mt-6" : "mt-1")}>
                        <h4 className="text-sm font-semibold text-white">Powered By</h4>
                        <div className="w-58 flex h-14 items-center justify-center rounded-lg bg-white p-2">
                            <img
                                src={H2OLogo}
                                alt="h2o-logo"
                                className="w-57 h-12"
                            />
                        </div>
                    </div>
                </div>
                <div className={cn(isDesktopDevice ? "w-1/2 p-2" : "h-1/2 p-1")}>
                    <div className={cn("flex flex-col items-center gap-4", isDesktopDevice ? "p-11" : "px-3 pt-5")}>
                        <h1 className="border-b border-solid border-royalBlue p-0.5 pt-0 text-2xl font-semibold text-royalBlue">{title}</h1>

                        {Form}
                    </div>
                </div>
                <div className="icon absolute left-1/2 top-1/2 z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white p-1 dark:bg-slateLight-800">
                    <div className="circle h-full w-full rounded-full bg-royalBlue dark:bg-slateLight-800">
                        <img
                            src={EarthLightLogo}
                            alt="Flow"
                            className="h-full w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthenticationCard;
