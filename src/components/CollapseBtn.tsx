import React from 'react'
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
interface CollapseBtnPropsType {
  className: string;
  onClick: () => void;
  note: string;
  children: React.ReactNode;
}

const CollapseBtn = ({ className, onClick, children, note }: CollapseBtnPropsType) => {
  return (
    <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className={`${className} bg-royalBlue text-slate-50 hover:bg-slate-900/90 rounded-md `} onClick={onClick} >
            {children}
          </TooltipTrigger>
          <TooltipContent side="top" align="center" sideOffset={20}  className="z-[11000]">
            <div className="text-black text-sm dark:text-white w-auto">
             {note}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

  )
}

export default CollapseBtn
