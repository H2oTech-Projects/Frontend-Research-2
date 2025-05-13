import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Control } from "react-hook-form";
import dayjs from "dayjs";

interface FormDatePickerProps {
  control: Control<any>;
  name: string;
  label: string;
}

export function FormDatePicker({ control, name, label }: FormDatePickerProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <FormLabel className="mt-1">{label}</FormLabel>
          <FormControl>
          <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                  {field.value ? dayjs(field.value).format("DD MMM YYYY") : "Pick a date"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[9999]">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => field.onChange(date)}
                disabled={(date) => dayjs(date).isAfter(dayjs())} // Prevent future dates
              />
            </PopoverContent>
          </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
