import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import  { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { waterAccountingYearTypeSchema } from '@/utils/schemaValidations/formSchema';
import { WaterAccoutingYearTypeForm } from '@/types/formTypes';
import { waterAccountingYearInitialValues } from '@/utils/initialFormValues';
import { convertKeysToSnakeCase } from '@/utils/stringConversion';
import { usePostWAY, usePutWAY, useGetWAY } from '@/services/timeseries';
import { useQueryClient } from '@tanstack/react-query';
import { GET_WAY_LIST_KEY, GET_WAY_KEY } from '@/services/timeseries/constant';
import dayjs from "dayjs";
import GeneralCalendar from '@/components/GeneralCalender';

interface WayFormProps {
  id: any;
  setEditId: any
}

const WayForm = ({
  id,
  setEditId
}: WayFormProps) => {
  const form = useForm<WaterAccoutingYearTypeForm>({
    resolver: zodResolver(waterAccountingYearTypeSchema),
    defaultValues: waterAccountingYearInitialValues,
    shouldUnregister: true,
  });
  const queryClient = useQueryClient();
  const [showStartDate, setShowStartDate] = useState<boolean>(false)
  const [showEndDate, setShowEndDate] = useState<boolean>(false)
  const [openM, setOpenM] = useState<boolean>(false);
  const { mutate: createWAY, isPending: isWAYcreating } = usePostWAY()
  const { mutate: updateWAY, isPending: isWAYUpdating } = usePutWAY()
  const { data: WAYDetail, isLoading } = useGetWAY(id);

  useEffect(() => {
    if (!!id) {
      setOpenM(true);
      queryClient.invalidateQueries({ queryKey: [GET_WAY_KEY, id] })
    }
  }, [id]);

  useEffect(() => {
    if (!!WAYDetail) {
      form.setValue("waYear", WAYDetail.data.wa_year)
      form.setValue("waStartDate", WAYDetail.data.wa_start_date)
      form.setValue("waEndDate", WAYDetail.data.wa_end_date)
    }
  }, [WAYDetail]);

  const handleCreateWAY = (data: WaterAccoutingYearTypeForm) => {
    const FormValue = convertKeysToSnakeCase({
      ...data,
    })
    const cleaned = Object.fromEntries(
      Object.entries(FormValue).filter(([_, value]) => value !== undefined)
    );
    console.log(cleaned)
    createWAY(cleaned, {
      onSuccess: (data: any) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: [GET_WAY_LIST_KEY] })
        form.reset(); // Reset the form after successful submission
        setOpenM(false);
      },
      onError: (error) => {

      },
    });
  }

  const handlePutWAY = (data: WaterAccoutingYearTypeForm) => {
    const FormValue = convertKeysToSnakeCase({
      ...data,
      id: id
    })
    const cleaned = Object.fromEntries(
      Object.entries(FormValue).filter(([_, value]) => value !== undefined)
    );
    updateWAY(cleaned, {
      onSuccess: (data: any) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: [GET_WAY_LIST_KEY] })
        setEditId(null)
        form.reset(); // Reset the form after successful submission
        setOpenM(false);
      },
      onError: (error) => {

      },
    });
  }

  const onSubmit = (data: WaterAccoutingYearTypeForm) => {
    if (!id) {
      handleCreateWAY(data)
    } else {
      handlePutWAY(data)
    }
  };

  const setStartDate = (date: any) => {
    form.setValue("waStartDate", date)
    setShowStartDate(false)
  }

  const setEndDate = (date: any) => {
    form.setValue("waEndDate", date)
    setShowEndDate(false)
  }

  const hideStartDateCalendar = (hide: boolean) => {
    setShowStartDate(!hide)
  }

  const hideEndDateCalendar = (hide: boolean) => {
    setShowEndDate(!hide)
  }

  const title = !!id ? 'Edit' : 'Add'
  return (
    <>
      <Dialog open={openM} onOpenChange={()=>{setOpenM(!openM);setEditId(null);}}>
          <DialogTrigger asChild>
            <Button variant={"default"} className="h-7 w-auto px-2 text-sm mr-2" onClick={() => setOpenM(true)}>
              <Plus size={4} />
              Add Water Accounting Year
            </Button>
          </DialogTrigger>
          <DialogContent className={`sm:max-w-[625px] pr-10 h-[350px]`}>
            <DialogHeader>
              <DialogTitle>{title} Water Accounting Year</DialogTitle>
            </DialogHeader>
            <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex-col">
              <div className="flex justify-between">
                <div className="pl-[20px] h-14 w-25 flex-none ">Accounting Year: </div>
                <div className="pr-[30px] h-14 w-[320px] flex-none">
                <FormField
                  control={form.control}
                  name={"waYear"}
                  render={({ field }) => (
                  <FormControl>
                    <Input
                      type={"text"}
                      {...field}
                      autoComplete="off"
                      disabled={false}
                    />
                  </FormControl>)
                  }/>
                </div>
              </div>
              <div className="flex justify-between">
              <div className="pl-[20px] h-14 w-25 flex-none ">Start Date: </div>
                <div className="pr-[30px] h-14 w-[320px] flex-none">
                  <Button variant="outline"  className="w-[320px]" onClick={() => {setShowEndDate(false); setShowStartDate(!showStartDate)}}>
                    {form.getValues('waStartDate') ? dayjs(form.getValues('waStartDate')).format("DD MMM YYYY") : dayjs().format("DD MMM YYYY")}
                  </Button>
                  {showStartDate && <GeneralCalendar
                    setDate={setStartDate}
                    hideCalendar={hideStartDateCalendar}
                  />}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="pl-[20px] h-14 w-25 flex-none ">End Date: </div>
                <div className="pr-[30px] h-14 w-[320px] flex-none">
                  <Button variant="outline"  className="w-[320px]" onClick={() => {setShowEndDate(!showEndDate); setShowStartDate(false)}}>
                  {form.getValues('waEndDate') ? dayjs(form.getValues('waEndDate')).format("DD MMM YYYY") : dayjs().format("DD MMM YYYY")}
                  </Button>
                  {showEndDate && <GeneralCalendar
                    setDate={setEndDate}
                    hideCalendar={hideEndDateCalendar}
                  />}
                  </div>
              </div>
            </div>

            <DialogFooter className="w-full">
              <div className="flex justify-start w-full gap-2">
                <DialogClose asChild >
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </div>
            </DialogFooter>
            </form>
            </Form>
          </DialogContent>
      </Dialog>
    </>
  )
};

export default WayForm;
