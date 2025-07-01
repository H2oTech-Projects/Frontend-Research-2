import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@uidotdev/usehooks";

type RtSelectProps = {
  dropdownList: { label: string; value: string }[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  label: string;
  showSearch?: boolean;
}



const RtSelect = ({dropdownList,selectedValue,setSelectedValue,label,showSearch=true}:RtSelectProps) => {
const [open, setOpen] = useState(false);
const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  return (
    <div className={cn("flex items-center gap-2  ","w-[40rem]")}>
                    <label className="min-w-[6rem] flex gap-1"><span>{label}:</span> </label>
                   <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("justify-between h-8 font-normal w-[30rem]")}
                      >
                        <div >
                          {selectedValue
                          ? dropdownList?.find((email) => email.value === selectedValue)?.label
                          : `Select ${label}...`}
                        </div>
                         <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className={cn("w-[--radix-popover-trigger-width] p-0 z-[800]")}>
                      <Command>
                        {showSearch && (
                          <CommandInput placeholder={`Search ${label}...`} className="h-9" />
                        )}
                        <CommandList>
                          <CommandEmpty>No Result Found.</CommandEmpty>
                          <CommandGroup>
                            {dropdownList?.map((email) => (
                                <CommandItem
                          key={email.value}
                          value={email.label}
                          onSelect={(currentValue:string) => {
                            const searchValue = dropdownList?.find((e) => e.label === currentValue);
                            setSelectedValue(searchValue ? searchValue.value : "");
                            setOpen(false);
                          }}
                        >
                                {email.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    selectedValue === email.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
  )
}

export default RtSelect
