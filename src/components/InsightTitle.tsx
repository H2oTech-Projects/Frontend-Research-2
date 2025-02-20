import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useState } from "react";

const InsightTitle = ({ title, note }: { title: string, note: string }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  // Handle touch events for mobile
  const handleTouchStart = () => {
    setIsTooltipOpen(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsTooltipOpen(false);
    }, 500); // Delay to mimic hover effect
  };

  return (
    <div className="text-black dark:text-white  font-semibold mt-3 ">
      {title}
      <TooltipProvider>
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}> <Info className="inline-block items-baseline ml-2" size={24} /></TooltipTrigger>
          <TooltipContent side="right" align="center" sideOffset={10} className="z-[850]">
            <div className="text-black text-sm dark:text-white w-[300px]">
              {note}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default InsightTitle
