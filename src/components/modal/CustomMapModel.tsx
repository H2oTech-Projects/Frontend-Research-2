import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";


interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // description?: string;
   children?: React.ReactNode;
}

const MobileMapPopup: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children
  // description,

}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1111] flex items-center justify-center bg-black/50 !pointer-events-auto">
      <div className={cn("relative bg-royalBlue rounded-xl shadow-lg  animate-fade-in dark:bg-slate-800 dark:text-slate-50 w-[22rem]  h-[40rem] overflow-hidden")}>
        <button
          onClick={onClose}
          className="absolute -top-0 -right-0 flex h-7 w-7 items-center justify-center text-white "
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-sm text-white p-3 font-semibold">{title}</h2>
        <div className=" h-[38rem] pb-2">{children}</div>    
      </div>
    </div>
  );
};

export default MobileMapPopup;
