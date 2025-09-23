import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import React from "react";

type WrapperProps = {
  className?: string;
  children: React.ReactNode;
};

type mableWrapperProps = {
  firstClassName?: string;
  secondClassName?: string;
  collapse: "map" | "table" | "default";
  children: React.ReactNode;
}

type tableWrapper = {
  className?: string;
  collapse: "map" | "table" | "default";
  children: React.ReactNode;
};

export const MablePageWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={`flex h-full flex-col gap-1 px-4 pt-2 ${className || ""}`}>
      {children}
    </div>
  );
};

export const MableContainerWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={` flex flex-grow flex-col gap-3 ${className || ""}`}>
      {children}
    </div>
  )
}
export const MableHeaderWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={` flex justify-between ${className || ""}`}>
      {children}
    </div>
  )
}

export const MableBodyWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={` flex justify-between ${className || ""}`}>
      {children}
    </div>
  )
}
export const TableWrapper: React.FC<mableWrapperProps> = ({ children, firstClassName, secondClassName, collapse }) => {
  return (
    <div className={cn("w-1/2", firstClassName, collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
      <div className={cn("relative h-[calc(100dvh-160px)]  md:h-[calc(100vh-160px)] w-full ]", secondClassName)}>
        {children}
      </div>
    </div>
  )
}
export const MapWrapper: React.FC<mableWrapperProps> = ({ children, firstClassName, secondClassName, collapse }) => {
  return (
    <div className={cn("w-1/2", collapse === "map" ? "hidden" : "", collapse === "table" ? "flex-grow" : "pl-3", firstClassName)}>
      <div
        className={cn("Mable-Map relative flex h-[calc(100dvh-160px)]  md:h-[calc(100vh-160px)] w-full", secondClassName)}
        id="map"
      >      {children}
      </div>
    </div>
  )
}

export const TableWrapperWithWapWay: React.FC<tableWrapper> = ({ children, className, collapse }) => {
  return (
    <div className={cn("relative w-1/2 flex flex-col gap-3 h-[calc(100vh-160px)]", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3", className)}>
      {children}
    </div>
  )
}

export const TableDropdownWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={`flex flex-col gap-2 bg-white p-2  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors ${className}`}>
      {children}
    </div>
  )
}

export const TableOnlyWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={cn(" h-[calc(100dvh-312px) w-full",className)}>
      {children}
    </div>
  )
}