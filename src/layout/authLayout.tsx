import React from 'react'
import RegisterImage from "../assets/RIGB.png";
import NightRegisterImage from "../assets/NRIGB.png";
import FlowLogo from "../assets/Circular-Light-Gray.png";
import { ChevronLeft, Info } from 'lucide-react';

type AuthLayoutProps = {
  header: React.ReactNode;
  title: string;
  titleDescription: string;
  children: React.ReactNode;
};

const AuthLayout = ({header,title,titleDescription,children}:AuthLayoutProps) => {
  return (
   <>
      <div className="flex min-h-screen w-full">
        <div className="w-[440px] text-white relative ">
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

        {/* Right Form Section */}
        <div className="flex flex-col flex-grow dark:bg-sky-950">
            {/* Top Navigation */}
            <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-600 dark:text-white">
              <div className="flex items-center gap-1 cursor-pointer hover:underline">
                <ChevronLeft size={16} />
                <span>Return Home</span>
              </div>
              <div className="text-right text-sm">
                {header}
              </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center dark:text-white ">
              {/* Title Section */}
              <div className="flex flex-col gap-1 justify-center items-center mt-5">
                <h1 className="font-semibold text-2xl">
                 {title}
                </h1>
                <h4 className="font-thin">{titleDescription}</h4>
              </div>

              {/* Form Section */}
              <div className="flex justify-center">
              {children}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-4 py-3 text-xs text-gray-400">
              <div>Copyright 2025 - 2022 H2otechonline All rights Reserved</div>
              <div className="flex items-center gap-1 cursor-pointer hover:underline">
                <Info size={14} />
                <span>Need help?</span>
              </div>
            </div>

          </div>
        </div>
    </>
  )
}

export default AuthLayout
