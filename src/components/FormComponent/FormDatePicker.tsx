import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Control, useWatch } from "react-hook-form";
import dayjs from "dayjs";

import * as React from "react"
import { CaptionProps } from "react-day-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DropdownCaptionProps extends CaptionProps {
  fromYear: number
  toYear: number
  onMonthChange: (date: Date) => void
}

export function DropdownCaption({
  displayMonth,
  onMonthChange,
  fromYear,
  toYear,
}: DropdownCaptionProps) {
  const months = Array.from({ length: 12 }).map((_, i) =>
    new Date(2020, i, 1).toLocaleString(undefined, { month: "long" })
  )

  const years = React.useMemo(() => {
    const yearList = []
    for (let y = fromYear; y <= toYear; y++) yearList.push(y)
    return yearList
  }, [fromYear, toYear])

  const handleMonthChange = (value: string) => {
    const month = parseInt(value)
    const year = displayMonth.getFullYear()
    onMonthChange(new Date(year, month))
  }

  const handleYearChange = (value: string) => {
    const year = parseInt(value)
    const month = displayMonth.getMonth()
    onMonthChange(new Date(year, month))
  }

  return (
    <div className="flex justify-center gap-2 py-2">
      <Select value={displayMonth.getMonth().toString()} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[150px] h-8 text-sm">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="z-[9999] h-72">
          {months.map((month, i) => (
            <SelectItem key={i} value={i.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={displayMonth.getFullYear().toString()} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[100px] h-8 text-sm">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="z-[9999] h-72">
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}



interface FormDatePickerProps {
  control: Control<any>;
  name: string;
  label: string;
  disabled?: boolean;
}

export function FormDatePicker({ control, name, label,disabled=false }: FormDatePickerProps) {
  const watchedDate = useWatch({
    control: control,
    name: name,
  });
 const fromYear = 1900;
  const toYear = 2100;
  const [month, setMonth] = React.useState<Date | undefined>(undefined);
  React.useEffect(() => {
  setMonth(watchedDate ? new Date(watchedDate) : new Date());
},[watchedDate])
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
                <Button variant="outline" disabled={disabled}>
                  {field.value ? dayjs(field.value).format("DD MMM YYYY") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="z-[9999] p-0">
               <Calendar
                  mode="single"
                  selected={new Date(field.value)}
                  onSelect={(date) => {
                    field.onChange(date);
                    setMonth(date); // update visible month
                  }}
                  month={month}
                  onMonthChange={(newMonth) => setMonth(newMonth)}
                  captionLayout="dropdown"
                  fromYear={fromYear}
                  toYear={toYear}
                  disabled={(date) => dayjs(date).isAfter(dayjs())}
                  components={{
                    Caption: (captionProps) => (
                      <DropdownCaption
                        {...captionProps}
                        fromYear={fromYear}
                        toYear={toYear}
                        onMonthChange={setMonth} // ✅ Pass your own month setter
                      />
                    )
                  }}
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