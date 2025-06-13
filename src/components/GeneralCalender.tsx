import  { useState, useEffect } from 'react'
import { DayPicker } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import { DropdownCaption } from '@/components/FormComponent/FormDatePicker';

export type CalendarProps = React.ComponentProps<typeof DayPicker>

type GeneralCalendarProps = {
  setDate: (date: string) => void;
  hideCalendar: (data: boolean) => void;
};

function GeneralCalendar({
  setDate,
  hideCalendar,
  ...props
}: GeneralCalendarProps) {
  const [month, setMonth] = useState(new Date());
  return (<Calendar
      className="z-[9999] p-3 bg-[white]"
      mode="single"
      selected={new Date()}
      onSelect={(date) => {
        //console.log('yes',dayjs(date).format("YYYY-MM-DD"))
        setDate(dayjs(date).format("YYYY-MM-DD"))
        //setDateInterval((prev: any) => ({...prev, 'endDate': dayjs(date).format("YYYY-MM-DD")}))
        hideCalendar(true)

      }}
      month={month}
      onMonthChange={(newMonth) => {console.log(newMonth);setMonth(newMonth)}}
      captionLayout="dropdown"
      fromYear={1900}
      toYear={2100}
      //disabled={(date) => dayjs(date).isAfter(dayjs())}
      components={{
        Caption: (captionProps) => (
          <DropdownCaption
            {...captionProps}
            fromYear={1900}
            toYear={2100}
            onMonthChange={(newMonth: any) => {console.log(newMonth);setMonth(newMonth)}} // ✅ Pass your own month setter
          />
        )
      }}
    />
  )
}

export default GeneralCalendar;