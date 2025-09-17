import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import React from "react";

type WrapperProps = {
  className?: string;
  children: React.ReactNode;
};

export const FormPageHeader: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={`flex justify-between items-center ${className || ""}`}>
      {children}
    </div>
  );
};

export const FormPageWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={`h-full w-full px-4 pt-2 ${className || ""}`}>
      {children}
    </div>
  );
};

export const FormWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-5 mt-3 h-[calc(100vh-138px)] overflow-y-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white ${className || ""}`}>
      {children}
    </div>
  );
};

export const FormMapWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={`h-[calc(100vh-228px)] ${className}`}>
      {children}
    </div>
  )
};

export const FormFieldsWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  return (
    <div className={cn(`grid  gap-4 mb-4 ${className}`,isDesktopDevice ? "grid-cols-3" : "grid-cols-1")}>
      {children}
    </div>
  )
};