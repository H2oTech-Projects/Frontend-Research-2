import  { useState } from "react";
import { RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; 

const Collect = () => {
  const [key, setKey] = useState(0);
  const refreshIframe = () => {
    setKey((prev) => prev + 1); // Changing key refreshes the iframe
  };

  return (
    <div className="flex flex-col gap-2 px-3 py-2">
      <div className="relative w-full h-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={refreshIframe}
                className="absolute top-2 right-5 z-10 rounded bg-blue-600 p-2 text-white hover:bg-blue-700 transition"
              >
                <RefreshCcw size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              Refresh Form
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Iframe */}
        <iframe
          key={key}
          src="https://fielddata.davidsengineering.com/-/single/WoAHUhCUUtVfCnQg5IwBoASaiFDyrpR?st=9JH7HgmxiYVi2wtuo!zsMO!7mk$9C3TDutMNPtezw8qBubAFDptgQEPqGT8gxA0Y"
          title="Collect Page"
          className="w-full h-[calc(100vh-76px)] rounded-xl border"
        />
      </div>
    </div>
  );
};

export default Collect;
