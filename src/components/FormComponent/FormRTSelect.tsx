import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormComboBoxProps {
  control: Control<any>;
  name: string;
  label: string;
  options: { label: string; value: string | number }[];
  className?: string;
  placeholder?: string;
}

export function FormComboBox({ control, name, label, options, placeholder = "Select an option", className }: FormComboBoxProps) {
  const watchedValue = useWatch({
    control: control,
    name: name,
  });
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full h-10 justify-between font-normal px-3 py-2", !watchedValue && "text-muted-foreground text-slate-400")}
                  disabled={options.length === 0}
                >
                  {watchedValue && options.length !== 0 ? options?.find((option) => option.value === field.value)?.label : placeholder}
                  <ChevronsUpDown className="opacity-50" />
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
                        onSelect={() => field.onChange(option.value)}
                      >
                        {option.label}
                        <Check className={cn("ml-auto", option.value === field.value ? "opacity-100" : "opacity-0")} />
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
