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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/cn";

type RtSelectProps = {
  dropdownList: { label: string; value: string }[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  label: string;
}



const RtSelect = ({dropdownList,selectedValue,setSelectedValue,label}:RtSelectProps) => {
const [open, setOpen] = useState(false)
  return (
    <div className="flex items-center gap-2">
                    <label>{label} : </label>

                   <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[250px] justify-between"
                      >
                        {selectedValue
                          ? dropdownList.find((email) => email.value === selectedValue)?.label
                          : `Select ${label}...`}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0 z-[800]">
                      <Command>
                        <CommandInput placeholder={`Search ${label}...`} className="h-9" />
                        <CommandList>
                          <CommandEmpty>No Result Found.</CommandEmpty>
                          <CommandGroup>
                            {dropdownList.map((email) => (
                                <CommandItem
                          key={email.value}
                          value={email.label}  
                          onSelect={(currentValue:string) => {
                            const searchValue = dropdownList.find((e) => e.label === currentValue);
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
