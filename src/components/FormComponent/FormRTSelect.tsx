import React, { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsDown, ChevronsUpDown } from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormComboBoxProps {
  control: Control<any>;
  name: string;
  label?: string;
  options: { label: string; value: string | number }[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FormComboBox({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  className,
  disabled = false

}: FormComboBoxProps) {
  const watchedValue = useWatch({
    control,
    name,
  });

  const [open, setOpen] = useState(false); // 🔥 Manage popover open state

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          {!!label && <FormLabel>{label}</FormLabel>}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full h-10 justify-between font-normal px-3 py-2",
                    !watchedValue && "text-muted-foreground text-slate-400"
                  )}
                  disabled={disabled}
                >
                  {watchedValue && options?.length !== 0
                    ? options.find((option) => option.value === field.value)?.label
                    : placeholder}
                  <ChevronsDown className="opacity-80" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0 z-[900]">
              <Command>
                <CommandInput placeholder="Search..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                          field.onChange(option.value);
                          setOpen(false); // ✅ Close the popover
                        }}
                      >
                        {option.label}
                        <Check
                          className={cn("ml-auto", option.value === field.value ? "opacity-100" : "opacity-0")}
                        />
                      </CommandItem>
                    ))}
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
