import  { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Collect = () => {
  const Name = useSelector((state: any) => state.auth.user)?.split("@")?.[0];
  const [key, setKey] = useState(0);
  const refreshIframe = () => {
    setKey((prev) => prev + 1); // Changing key refreshes the iframe
  };

  const getUrl = () =>{
    !Name?.includes('colusa')
    if (!Name?.includes('madera')){
      return "https://fielddatastaging.davidsengineering.com/-/single/8hqRnJ79xmXVyytPddh7uNNkO5tkbk6?st=HM1wWTj0dds0KghSc9lAIa$iM4niEKcu8NJERaWWaRwWvXWwN8XiLhmyZ2d1qrI9"
    } else if (!Name?.includes('colusa')){
      return "https://fielddatastaging.davidsengineering.com/-/single/XT7LfLuCVFAvUfRK88SbsozcRsBmTmE?st=InVJBwxePovvOTPDAyoqXufP9QOZ1KT4IYyaYG85UhpzNRW1PewVFQv4ZVSttgJq"
    }
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-2">
      <div className="relative w-full h-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={refreshIframe}
                className="absolute top-2 right-5 z-10 rounded bg-royalBlue p-2 text-white hover:bg-blue-700 transition"
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
          src={getUrl()}
          title="Collect Page"
          className="w-full h-[calc(100vh-76px)] rounded-xl border"
        />
      </div>
    </div>
  );
};

export default Collect;
