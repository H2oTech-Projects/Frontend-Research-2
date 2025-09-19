import React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@uidotdev/usehooks";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;             
  placeholder?: string;            
};

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
}) => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  return (
    <div className="flex gap-2">
      <div className="flex items-center h-7 w-52 gap-x-2 rounded-lg border border-slate-300 px-2 text-base bg-slate-50 text-slate-900 transition-colors dark:bg-slate-900 dark:focus:border-blue-600">
        <Search size={16} className="text-slate-300" />
        <input
          name="search"
          id="search"
          placeholder={placeholder}
          value={value}
          className="w-full bg-transparent text-sm text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {isDesktopDevice && value &&  (
        <Button
          variant="default"
          className="h-7 w-7"
          onClick={onClear}
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;