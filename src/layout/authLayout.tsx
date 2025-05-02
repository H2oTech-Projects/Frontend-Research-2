import React from 'react'
import RegisterImage from "../assets/RIGB.png";
import NightRegisterImage from "../assets/NRIGB.png";
import FlowLogo from "../assets/Circular-Light-Gray.png";
import BlackFlowLogo from "../assets/Circular-Black.png";
import { ChevronLeft, Info } from 'lucide-react';
import { useMediaQuery } from '@uidotdev/usehooks';
import { cn } from '@/utils/cn';

type AuthLayoutProps = {
  header: React.ReactNode;
  title: string;
  titleDescription: string;
  children: React.ReactNode;
};

const AuthLayout = ({header,title,titleDescription,children}:AuthLayoutProps) => {
  const isDesktopDevice = useMediaQuery("(min-width: 854px)");
  return (
   <>
      <div className="flex min-h-screen w-full">
        <div className={cn("w-[440px] text-white relative",!isDesktopDevice ? "hidden" : "")}>
          <div className="z-10 flex flex-col justify-between h-full px-6 py-10">
            <div className="flex justify-center items-center align-center mb-4 gap-3">
              <img src={FlowLogo} alt="Flow Logo" className="w-16 h-16 mb-2" />
              <span className="text-3xl font-semibold ">FLOW</span>
            </div>

            {/* Bottom Text */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Water Accounts for Your Fields</h2>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
              </p>
            </div>
          </div>
          <img
            src={RegisterImage}
            alt="H2O Logo"
            className="w-full h-full object-cover -z-10 absolute top-0 left-0 dark:hidden"
          />
          <img
            src={NightRegisterImage}
            alt="H2O Logo"
            className="w-full h-full object-cover -z-10 absolute top-0 left-0 hidden dark:block"
          />
        </div>

        <div className={cn("flex flex-col flex-grow ", !isDesktopDevice ? "relative" : " dark:bg-sky-950")}>
            {/* Mobile Image Section */}
          {!isDesktopDevice && <img src={RegisterImage} alt="H2O Logo" className="w-full h-full object-cover -z-10 absolute top-0 left-0 dark:hidden" />}
          {!isDesktopDevice && <img src={NightRegisterImage} alt="H2O Logo" className="w-full h-full object-cover -z-10 absolute top-0 left-0 hidden dark:block" />}
          {/* Top Navigation */}
          <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-600 dark:text-white">
            <div className="flex items-center gap-1 cursor-pointer hover:underline">
              <ChevronLeft size={16} />
              <span>Return Home</span>
            </div>
            {isDesktopDevice &&  <div className="text-right text-sm">
              {header}
            </div>}
          </div>

            <div className="flex-grow flex flex-col items-center justify-center dark:text-white h-auto">
              {/* Mobile  Logo Section */}
              {!isDesktopDevice &&  <div className="flex justify-center items-center align-center gap-3">
                <img src={FlowLogo} alt="Flow Logo" className="w-16 h-16 mb-2 hidden dark:block" />
                <img src={BlackFlowLogo} alt="Flow Logo" className="w-16 h-16 mb-2 dark:hidden" />
                <span className="text-3xl font-semibold ">FLOW</span>
                </div>}
              {/* Title Section */}
              <div className={cn("flex flex-col  justify-center items-center mt-5",isDesktopDevice ? "gap-1 mt-5" : "gap-3 mt-2")}>
                <h1 className={cn("font-semibold ",isDesktopDevice ? "text-2xl" : "text-xl")}>
                 {title}
                </h1>
                <h4 className={cn("font-thin",isDesktopDevice ? "" : "text-sm")}>{titleDescription}</h4>
              </div>

              {/* Form Section */}
              <div className="flex justify-center">
                {children}
              </div>
              {/* converted header to footer for mobile view */}
              {!isDesktopDevice && <div className="text-right text-sm mt-4">
                {header}
                </div>
              }
               {!isDesktopDevice &&   <div className="flex items-center gap-1 cursor-pointer hover:underline mt-4">
                <Info size={14} />
                <span>Need help?</span>
              </div>
              }
            </div>

            {/* Footer */}
            <div className={cn("flex  items-center px-4 py-3 text-xs dark:text-gray-400", isDesktopDevice ? "justify-between" : "justify-center")}>
              <div>Copyright 2025 - 2022 H2oTech All rights Reserved</div>
              {isDesktopDevice &&   <div className="flex items-center gap-1 cursor-pointer hover:underline">
                <Info size={14} />
                <span>Need help?</span>
                </div>
              }
            </div>
        </div>
      </div>
    </>
  )
}

export default AuthLayout
