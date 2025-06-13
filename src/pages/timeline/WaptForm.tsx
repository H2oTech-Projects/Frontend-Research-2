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

import { waterAccountingPeriodTypeSchema } from '@/utils/schemaValidations/formSchema';
import { WaterAccoutingPeriodTypeForm } from '@/types/formTypes';
import { waterAccountingRatePeriodInitialValues } from '@/utils/initialFormValues';
import { convertKeysToSnakeCase } from '@/utils/stringConversion';
import { usePostWAPT, usePutWAPT, useGetPeriodType } from '@/services/timeseries';
import { useQueryClient } from '@tanstack/react-query';
import { GET_WAPT_LIST_KEY, GET_WAPT_KEY } from '@/services/timeseries/constant';
interface WaptFormProps {
  id: any;
  setEditId: any
}

const WaptForm = ({
  id,
  setEditId
}: WaptFormProps) => {
  const form = useForm<WaterAccoutingPeriodTypeForm>({
    resolver: zodResolver(waterAccountingPeriodTypeSchema),
    defaultValues: waterAccountingRatePeriodInitialValues,
    shouldUnregister: true,
  });

  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: createWAPT, isPending: isWAPTcreating } = usePostWAPT()
  const { mutate: updateWAPT, isPending: isWAPTUpdating } = usePutWAPT()
  const { data: WAPTDetail, isLoading } = useGetPeriodType(id);

  useEffect(() => {
    if (id) {
      setOpen(true);
      queryClient.invalidateQueries({ queryKey: [GET_WAPT_KEY] })
    }
  }, [id]);

  useEffect(() => {
    if (!!WAPTDetail) {
      form.setValue("waPeriodType", WAPTDetail.data.wa_period_type)
      form.setValue("waPeriodTypeName", WAPTDetail.data.wa_period_type_name)
    }
  }, [WAPTDetail]);

  const handleCreateWAPT = (data: WaterAccoutingPeriodTypeForm) => {
    const FormValue = convertKeysToSnakeCase({
      ...data,
      client: JSON.parse(localStorage.getItem("auth") || "null")?.client_id
    })
    const cleaned = Object.fromEntries(
      Object.entries(FormValue).filter(([_, value]) => value !== undefined)
    );
    createWAPT(cleaned, {
      onSuccess: (data: any) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: [GET_WAPT_LIST_KEY] })
        form.reset(); // Reset the form after successful submission
        setOpen(false);
      },
      onError: (error) => {

      },
    });
  }

  const handlePutWAPT = (data: WaterAccoutingPeriodTypeForm) => {
    const FormValue = convertKeysToSnakeCase({
      ...data,
      id: id
    })
    const cleaned = Object.fromEntries(
      Object.entries(FormValue).filter(([_, value]) => value !== undefined)
    );
    updateWAPT(cleaned, {
      onSuccess: (data: any) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: [GET_WAPT_LIST_KEY] })
        setEditId(null)
        form.reset(); // Reset the form after successful submission
        setOpen(false);
      },
      onError: (error) => {

      },
    });
  }

  const onSubmit = (data: WaterAccoutingPeriodTypeForm) => {
    if (!id) {
      handleCreateWAPT(data)
    } else {
      handlePutWAPT(data)
    }
  };
  const [showNextModal, setShowNextModal] = useState(false);
  const hideDialogContent = showNextModal ? "hidden" : ''
  const title = !!id ? 'Edit' : 'Add'

  return (
    <>
      <Dialog open={open} onOpenChange={()=>{setOpen(!open);setEditId(null)}}>
          <DialogTrigger asChild>
            <Button variant={"default"} className="h-7 w-auto px-2 text-sm mr-2" onClick={() => setOpen(true)}>
              <Plus size={4} />
              Add Water Accounting Period Type
            </Button>
          </DialogTrigger>
          <DialogContent className={`sm:max-w-[625px] pr-10 h-[250px] ${hideDialogContent}`}>
            <DialogHeader>
              <DialogTitle>{title} Water Accounting Period Type</DialogTitle>
            </DialogHeader>
            <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex-col">
              <div className="flex justify-between">
                <div className="pl-[20px] h-14 w-25 flex-none ">Period Type: </div>
                <div className="pr-[30px] h-14 w-[320px] flex-none">
                <FormField
                  control={form.control}
                  name={"waPeriodType"}
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
                <div className="pl-[20px] h-14 w-25 flex-none ">Period Type Name: </div>
                <div className="pr-[30px] h-14 w-[320px] flex-none">
                <FormField
                  control={form.control}
                  name={"waPeriodTypeName"}
                  render={({ field }) => (
                  <FormControl>
                    <Input
                      type={"text"}
                      autoComplete="off"
                      {...field}
                      disabled={false}
                    />
                  </FormControl>)
                  }/>
                </div>
              </div>
            </div>
            <DialogFooter className="w-full">
              <div className="flex justify-start w-full gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </div>
            </DialogFooter>
            </form>
            </Form>
          </DialogContent>
      </Dialog>

    {/* {showNextModal && <PeriodTypeForm/>} */}
    </>
  )
};

export default WaptForm;
