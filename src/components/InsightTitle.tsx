import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

const InsightTitle = ({ title, note }: { title: string, note: string }) => {
  return (
    <div className="text-black dark:text-white  font-semibold mt-3">
      {title}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger> <Info className="inline-block items-baseline ml-2" size={24} /></TooltipTrigger>
          <TooltipContent side="right" align="center" sideOffset={10}>
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
