import { Link } from "react-router-dom";
import EarthLightLogo from "../../assets/earth-dark.svg";
import H2OLogo from "../../assets/logo.png";
import { Mail, ArrowLeft } from "lucide-react";
const ForgotPassword = () => {
    return (
        <div className="flex min-h-screen content-center items-center justify-center bg-slateLight-100 transition-colors dark:bg-slateLight-950">
            <div className="relative flex h-[420px] w-[800px] overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slateLight-800">
                <div className="bg-royalBlue flex w-1/2 flex-col items-center gap-3 p-5">
                    <h1 className="m-4 text-5xl font-bold text-white">Flow</h1>
                    <h3 className="m-3 text-2xl font-thin text-slate-300">Water Accounting Application</h3>
                    <div className="flex flex-col items-center">
                        <p className="text-base font-thin text-slate-300">Data from all your fields in one </p>
                        <p className="text-base font-thin text-slate-300">easy to access spot.</p>
                    </div>
                    <div className="mt-6 flex flex-col items-center gap-3">
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
                <div className="rightPart w-1/2 p-2">
                    <div className="flex flex-col items-center gap-4 p-11">
                        <h1 className="text-royalBlue border-royalBlue border-b border-solid p-0.5 pt-0 text-2xl font-semibold">Forgot Password?</h1>
                        <p className="text-royalBlue">Enter your Email to recover account</p>
                        <form
                            action="login"
                            className="mt-6 flex w-full flex-col items-center gap-6"
                        >
                            <div className="input text-royalBlue w-full rounded-2xl p-3">
                                <Mail size={20} />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-royalBlue h-10 w-56 rounded-2xl text-base font-semibold text-white hover:bg-blue-500"
                            >
                                Continue
                            </button>
                            <Link
                                to="/auth/login"
                                className="text-royalBlue border-royalBlue -mt-4 flex items-center justify-center gap-1 border-b border-solid p-0.5"
                            >
                                <ArrowLeft size={15} /> Back
                            </Link>
                        </form>
                    </div>
                </div>
                <div className="icon z-16 absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white p-1">
                    <div className="circle bg-royalBlue h-full w-full rounded-full">
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

export default ForgotPassword;
