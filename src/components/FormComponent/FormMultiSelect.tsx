import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsDown } from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormMultiComboBoxProps {
  control: Control<any>;
  name: string;
  label: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function FormMultiComboBox({
  control,
  name,
  label,
  options,
  placeholder = "Select options",
  className,
  disabled = false,
}: FormMultiComboBoxProps) {
  const selectedValues = useWatch({ control, name }) || [];
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel>{label}</FormLabel>
          <Popover open={disabled ? false : open} onOpenChange={(v) => !disabled && setOpen(v)}>
            <PopoverTrigger asChild>
              <FormControl>
                <div className="flex flex-col w-full h-auto">
                  <Button
                    variant="outline"
                    role="combobox"
                    type="button"
                    className={cn(
                      "w-full h-10 justify-between font-normal px-3 py-2",
                      selectedValues?.length === 0 &&
                      "text-muted-foreground text-slate-400"
                    )}
                    disabled={disabled}
                  >
                    <div className="w-[80%] overflow-hidden flex justify-start">{selectedValues?.length > 0
                      ? (() => {
                        const selectedLabels = options
                          ?.filter((opt) => selectedValues.includes(opt.value))
                          ?.map((opt) => opt.label);
                        const displayed = selectedLabels?.slice(0, 2).join(", ");
                        const extraCount = selectedLabels?.length - 2;
                        return extraCount > 0 ? `${displayed}, ...` : displayed;
                      })()
                      : placeholder}</div>
                    <ChevronsDown className="opacity-80 ml-2" />
                  </Button>
                  {selectedValues?.length > 2 && (
                    <div className="flex gap-1 text-sm text-muted-foreground mt-1 px-1">
                      {options
                        .filter((opt) => selectedValues.includes(opt.value))
                        .map((opt) => opt.label)
                        .join(", ")}
                    </div>
                  )}

                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[--radix-popover-trigger-width] p-0 z-[900]"
            >
              <Command>
                <CommandInput placeholder="Search..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup>
                    {options?.map((option) => {
                      const isSelected = selectedValues?.includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => {
                            const newValues = isSelected
                              ? selectedValues.filter((v: any) => v !== option.value)
                              : [...selectedValues, option.value];

                            field.onChange(newValues);
                          }}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}