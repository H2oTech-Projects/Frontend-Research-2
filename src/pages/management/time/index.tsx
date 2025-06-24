import BasicSelect from '@/components/BasicSelect'
import DragItemWrapper from '@/components/DndComponent/DragListWrapper'
import { FormDatePicker } from '@/components/FormComponent/FormDatePicker'
import { FormInput } from '@/components/FormComponent/FormInput'
import { FormComboBox } from '@/components/FormComponent/FormRTSelect'
import CustomModal from '@/components/modal/ConfirmModal'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useDeleteWapt, useGetWaptOptions, useGetWaysDetails, useGetWaysOptions, usePostWapt, usePutWapt, usePutWays, } from '@/services/timeSeries'
import { DELETE_WAPTS, GET_WAPT_OPTIONS, GET_WAYS_DETAILS, POST_WAPTS, PUT_WAPTS, PUT_WAYS } from '@/services/timeSeries/constants'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { showErrorToast } from '@/utils/tools'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowLeft, ArrowRight, Pencil, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type WayFormType = {
  // wayYear: string | undefined;
  wapList: {
    waptId: number;
    waPeriodName: string;
    waStartDate: Date | undefined;
    waEndDate: Date | undefined;
    pId?: number | null
  }[];
};

type WaptFormType = {
  id?: number | undefined;
  waptName: string;
}
const Time = () => {
  const queryClient = useQueryClient();
  const [wapYear, setWapYear] = useState<null | string>(null);
  const { data: wapTypeOptions, isLoading: isWapTypeOptionsLoading } = useGetWaptOptions()
  const { data: waysOptions, isLoading: waysOptionsLoading } = useGetWaysOptions();
  const [listOfWapType, setListOfWapType] = useState<any>([]);
  const [selectedWapType, setSelectedWapType] = useState<string[]>([]);
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number>();
  const { mutate: createWays, isPending: isWaysCreatePending } = usePutWays();
  const { mutate: postWapt, isPending: isWaptCreating } = usePostWapt();
  const { mutate: updateWapt, isPending: isWaptUpdating } = usePutWapt()
  const { mutate: deleteWapt, isPending: isWaptDeleting } = useDeleteWapt();
  const form = useForm<WayFormType>({
    defaultValues: {
      // wayYear: undefined,
      wapList: []
    },
  });
  const waptForm = useForm<WaptFormType>({
    defaultValues: {
      id: undefined,
      waptName: ""
    }
  })
  const { data: wayDetail, isLoading: isWayDetailLoading } = useGetWaysDetails(wapYear)
  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  // const countWapType = (data: any[], waptId: string) => data?.filter(item => item?.waptId.toString() === waptId).length
  const startEndDate = waysOptions?.data?.filter((item: any) => item.value === wapYear)

  useEffect(() => {
    if (wapTypeOptions && !isWapTypeOptionsLoading) {
      setListOfWapType(wapTypeOptions?.data)
    }
  }, [wapTypeOptions])

  useEffect(() => {
    if (waysOptions && !waysOptionsLoading) {
      waysOptions?.data && setWapYear(waysOptions?.data[0]?.value)
    }

  }, [waysOptions])


  const { fields, move, append, replace, remove } = useFieldArray({
    control: form.control,
    name: "wapList"
  });

  const handleLeftShift = () => {
    const transferItem = listOfWapType?.filter((item: any) => selectedWapType.includes(item.id));
    const list = form.watch("wapList");
    const listForForm = transferItem?.map((item: any, index: any) => {
      const wap = item?.waPeriodTypeName;
      const wapNumbers = fields
        .filter((field) => field.waPeriodName.toLowerCase().includes(wap.toLowerCase()))
        .map((field) => {
          const match = field.waPeriodName.match(/\d+$/);
          return match ? parseInt(match[0], 10) : 0;
        });

      const maxNumber = wapNumbers.length > 0 ? Math.max(...wapNumbers) : 0;
      const yearPrefix = startEndDate?.[0]?.waStartDate?.split?.('-')?.[0] || "";
      const periodName = `${yearPrefix} ${wap} ${formatNumber(maxNumber + 1)}`;

      if (index === 0 && list.at(-1)?.waEndDate) {
        const startDate = new Date(list.at(-1)?.waEndDate!);
        startDate.setDate(startDate.getDate() + 1);
        return {
          waptId: item?.id,
          waPeriodName: periodName,
          waStartDate: startDate,
          waEndDate: undefined,
        };
      } else {
        return {
          waptId: item?.id,
          waPeriodName: periodName,
          waStartDate: undefined,
          waEndDate: undefined,
        };
      }
    });
    if (list.length < 1) {
      listForForm[0].waStartDate = startEndDate[0].waStartDate;

    }
    listForForm.at(-1).waEndDate = startEndDate[0].waEndDate;
    append(listForForm);
    setSelectedWapType([]);
    setEnableSubmit(true);
  };


  const reorderList = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const list = form.watch("wapList");
    const oldIdx = fields.findIndex(item => item.id.toString() === e.active.id.toString());
    const newIdx = fields.findIndex(item => item.id.toString() === e.over!.id.toString());

    if (oldIdx === -1 || newIdx === -1) return;

    // Step 1: Reorder full items
    const sortedItems = arrayMove(fields, oldIdx, newIdx);

    const yearPrefix = startEndDate?.[0]?.waStartDate?.split?.('-')?.[0] || "";

    // Step 2: Extract existing suffix numbers per type
    const suffixMap: Record<string, number[]> = {};

    sortedItems.forEach((item) => {
      const label = listOfWapType.find((t: any) => t.id === item.waptId)?.waPeriodTypeName ?? "";
      const match = item.waPeriodName.match(/(\d+)$/);
      if (match) {
        if (!suffixMap[label]) suffixMap[label] = [];
        suffixMap[label].push(Number(match[1]));
      }
    });

    // Step 3: Sort suffixes for each type to maintain original order
    Object.keys(suffixMap).forEach(type => {
      suffixMap[type].sort((a, b) => a - b);
    });

    // Step 4: Apply suffixes back in order
    const typeIndexMap: Record<string, number> = {}; // to track position in suffix array
    const renamedItems = sortedItems.map((item) => {
      const label = listOfWapType.find((t: any) => t.id === item.waptId)?.waPeriodTypeName ?? "";
      const currentIndex = typeIndexMap[label] ?? 0;
      const suffix = suffixMap[label]?.[currentIndex] ?? 1;
      typeIndexMap[label] = currentIndex + 1;

      const newPeriodName = `${yearPrefix} ${label} ${String(suffix).padStart(2, '0')}`;

      return {
        ...item,
        pId: sortedItems?.filter((item) => item.waPeriodName.toString() === newPeriodName)[0]?.pId,
        waPeriodName: newPeriodName,
      };
    });

    const updatedArray = renamedItems?.map((item: any, index) => {
      return {
        pId: item?.pId,
        waPeriodName: item?.waPeriodName,
        waptId: item?.waptId,
        waStartDate: list[index]?.waStartDate,
        waEndDate: list[index]?.waEndDate
      }
    })

    replace(updatedArray);
    setEnableSubmit(true);
  };

  // const handleWapElementDelete = (deleteIndex: number) => {
  //   const initialWapList = form.getValues("wapList")
  //   const remainingWapList = fields.filter((item, index) => index !== deleteIndex)
  //   const updatedList = remainingWapList?.map((item, index) => {
  //     return {
  //       pId: item?.pId || null,
  //       waptId: item?.waptId,
  //       waPeriodName: item?.waPeriodName,
  //       waStartDate: initialWapList[index]?.waStartDate,
  //       waEndDate: initialWapList[index]?.waEndDate,
  //     }
  //   })
  //   updatedList.at(-1)!.waEndDate = startEndDate[0].waEndDate;
  //   replace(updatedList);
  //   setEnableSubmit(true);
  // }

  const handleWapElementDelete = (deleteIndex: number) => {
    const initialWapList = form.getValues("wapList");

    // Remove item
    const remainingList = initialWapList.filter((_, idx) => idx !== deleteIndex);

    const yearPrefix = startEndDate?.[0]?.waStartDate?.split?.('-')?.[0] || "";

    // 1. Group by type
    const typeGroups: Record<number, any[]> = {};
    for (const item of remainingList) {
      if (!typeGroups[item.waptId]) typeGroups[item.waptId] = [];
      typeGroups[item.waptId].push(item);
    }

    // 2. Sort each type group and rebuild waPeriodName
    const renamedList = remainingList.map((item, idx) => {
      const label = listOfWapType.find((t: any) => t.id === item.waptId)?.waPeriodTypeName ?? '';
      const typeGroup = typeGroups[item.waptId];
      const currentIndex = typeGroup.indexOf(item); // index within its type
      const suffix = String(currentIndex + 1).padStart(2, '0');
      return {
        ...item,
        waPeriodName: `${yearPrefix} ${label} ${suffix}`
      };
    });

    // 3. Re-assign start and end dates
    if (renamedList.length > 0) {
      renamedList[0].waStartDate = startEndDate[0]?.waStartDate;
      for (let i = 1; i < renamedList.length; i++) {
        const prevEnd = renamedList[i - 1]?.waEndDate;
        if (prevEnd) {
          const newStart = new Date(prevEnd);
          newStart.setDate(newStart.getDate() + 1);
          renamedList[i].waStartDate = newStart;
        }
      }
      renamedList.at(-1)!.waEndDate = startEndDate[0]?.waEndDate;
    }
    replace(renamedList);
    setEnableSubmit(true);
  };


  useEffect(() => {
    remove();
  }, [wapYear])

  const handleClick = (selectedList: any, setSelectedList: any, id: string) => {
    if (!selectedList.includes(id)) {
      setSelectedList([...selectedList, id])
    }
    else {
      setSelectedList((prev: any) => prev.filter((listId: any) => listId !== id))
    }
  }

  const onSubmit = (data: WayFormType) => {
    const formattedData = {
      wayYear: wapYear,
      wapList: data?.wapList?.map((item) => {
        return {
          id: item?.pId || null,
          waptId: item?.waptId,
          waPeriodName: item?.waPeriodName,
          waStartDate: item?.waStartDate ? dayjs(item.waStartDate).format("YYYY-MM-DD") : undefined,
          waEndDate: item?.waEndDate ? dayjs(item.waEndDate).format("YYYY-MM-DD") : undefined,
        }
      })
    }
    // console.log(formattedData)
    createWays(convertKeysToSnakeCase(formattedData), {
      onSuccess: (data: any) => {
        setEnableSubmit(false);
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: [GET_WAYS_DETAILS, wapYear] })
        queryClient.invalidateQueries({ queryKey: [PUT_WAYS] })
        // form.reset(); // Reset the form after successful submission
        // form.setValue("wayYear", waysOptions?.data[0]?.value)


      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
        queryClient.invalidateQueries({ queryKey: [PUT_WAYS] })
      },
    })
  }

  const onWaptSubmit = (data: WaptFormType) => {
    if (!data?.id) {
      postWapt(data, {
        onSuccess: (data: any) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({ queryKey: [GET_WAPT_OPTIONS] })
          queryClient.invalidateQueries({ queryKey: [POST_WAPTS] })
          waptForm.reset();
        },
        onError: (error) => {
          showErrorToast(error?.response?.data.message);
          queryClient.invalidateQueries({ queryKey: [POST_WAPTS] })
        },
      })
    } else {
      updateWapt(data, {
        onSuccess: (data: any) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({ queryKey: [GET_WAPT_OPTIONS] })
          queryClient.invalidateQueries({ queryKey: [PUT_WAPTS] })
          waptForm.reset({ id: undefined, waptName: "" });
        },
        onError: (error) => {
          showErrorToast(error?.response?.data.message);
          queryClient.invalidateQueries({ queryKey: [POST_WAPTS] })
        },
      })
    }
  }

  const handleDelete = () => {
    deleteWapt(id, {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: [GET_WAPT_OPTIONS] })
        queryClient.invalidateQueries({ queryKey: [DELETE_WAPTS] });
        toast.success("Period Type deleted successfully");
        console.log(data)
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
  };


  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name?.includes("waStartDate") && !name?.includes("waEndDate")) return;

      setEnableSubmit(true); // ✅ enable the button

      const indexMatch = name.match(/wapList\.(\d+)\.waEndDate/);
      if (!indexMatch) return;

      const index = Number(indexMatch[1]);
      const endDate = value.wapList?.[index]?.waEndDate;

      if (endDate && value.wapList?.[index + 1]) {
        const nextStartDate = new Date(endDate);
        nextStartDate.setDate(nextStartDate.getDate() + 1); // Add 1 day
        form.setValue(`wapList.${index + 1}.waStartDate`, nextStartDate);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (!isWayDetailLoading && wayDetail?.data) {
      form.setValue("wapList", wayDetail?.data?.map((item: any) => { return { ...item, pId: item?.id } }))
    }
  }, [wayDetail])

  useEffect(() => {
    setEnableSubmit(false)
  }, [wapYear])


  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Water Accounting Period"
        description="Are you sure you want to delete this period Type?"
        onConfirm={handleDelete}
      />

      <PageHeader
        pageHeaderTitle="Time "
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
      />
      <div className="pageContain flex flex-grow flex-col gap-3  ">
        <div className="flex w-full  h-[calc(100vh-140px)] justify-evenly items-center mt-2 gap-2">
          <div className="flex flex-col gap-4 w-[45%] h-[calc(100vh-150px)]   ">
            <div className='flex flex-col gap-2 bg-white p-2  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors'>
               <div className='text-lg text-royalBlue dark:text-slate-50 '>Select Water Accounting Year</div>
              <div className="px-2"><BasicSelect setValue={setWapYear}  Value={wapYear!}  itemList={waysOptions?.data} showLabel={false} /></div>
</div>
            <Form {...waptForm} >
              <form onSubmit={waptForm.handleSubmit(onWaptSubmit)} className="flex flex-col gap-2 w-full  bg-white p-2  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors ">
                <div className='text-lg text-royalBlue dark:text-slate-50 '>Create Water Accounting Period Types for {startEndDate?.[0]?.waStartDate?.split?.('-')?.[0] || ""}</div>
                <div className='flex w-full gap-2 p-2 '>
                  <div className='flex-grow'>  <FormInput
                    control={waptForm.control}
                    name='waptName'
                    label='Period Name'
                    placeholder='Enter Period Type Name'
                    type='text'
                    showLabel={false}
                  /></div>   <Button disabled={waptForm.watch("waptName") ? false : true} type="submit">{waptForm.watch('id') ? "Update" : "Create"}</Button> </div>

              </form>
            </Form>

            <div className="flex flex-col gap-2 w-full flex-grow  bg-white p-3  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors ">
              <div className='text-lg text-royalBlue dark:text-slate-50 '>Add Water Accounting Period Types for {startEndDate?.[0]?.waStartDate?.split?.('-')?.[0] || ""}</div>
              {isWapTypeOptionsLoading ? <>loading</> : <div className='flex flex-col gap-2 overflow-y-auto h-[calc(100vh-450px)]  '>
                {listOfWapType?.length > 0 && listOfWapType?.map((item: any) => <div key={item?.id} className="flex w-full gap-2 items-center h-auto bg-slate-400 dark:bg-slate-900 p-4 rounded">
                  <input className="h-5 w-5" type="checkbox" checked={selectedWapType.includes(item?.id)} onChange={() => handleClick(selectedWapType, setSelectedWapType, item?.id)} /> <div className="flex flex-grow text-xl">{item?.waPeriodTypeName}</div> <Button onClick={() => waptForm.reset({ id: item?.id, waptName: item?.waPeriodTypeName })}> <Pencil /></Button> <Button variant={"destructive"} onClick={() => { setId(item?.id); setOpen(true); }}><Trash /></Button>
                </div>)}
              </div>}
            </div>
          </div>

          <div className="w-[5%] flex flex-col items-center justify-center gap-2"><Button disabled={selectedWapType.length < 1} onClick={handleLeftShift} ><ArrowRight /> </Button></div>
          <Form {...form}>
            <form id="myForm" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 flex-grow h-[calc(100vh-150px)] w-[45%] bg-white p-3  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors  ">
              <div className='text-xl text-royalBlue dark:text-white transition-colors'>Create or Update Water Accounting Periods for {startEndDate?.[0]?.waStartDate?.split?.('-')?.[0] || ""}</div>
              {/* <div className="h-auto pb-2 px-2 w-1/2" >
                <FormComboBox
                  control={form.control}
                  name='wayYear'
                  label='Water Accounting Year'
                  placeholder='Select Year'
                  options={waysOptions?.data || []}

                />
              </div> */}
              {/* <div className="flex flex-col flex-grow overflow-y-auto g-2"> */}
              <DndContext onDragEnd={reorderList}  >
                <SortableContext items={fields.map((item: any, index) => item?.id?.toString())}>
                  <div className='flex flex-col flex-grow gap-2 overflow-y-auto overflow-x-hidden py-2'>

                    {fields.length > 0 && fields?.map((item: any, index) => {
                      return (<DragItemWrapper key={item?.id} id={item?.id?.toString()}>
                        <div className={cn("flex flex-col  w-full gap-2 items-center bg-slate-400 p-2 hover:bg-royalBlue rounded h-auto dark:bg-slate-900 dark:hover:bg-slate-400 transition-colors ")}>
                          <div className="flex w-full gap-2 items-center">
                            <div className="flex flex-grow text-xl">{item.waPeriodName}</div>    <Button variant={'destructive'} type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { handleWapElementDelete(index) }}> <Trash /></Button>
                          </div>
                          <div className="flex items-center justify-evenly w-full gap-3">

                            <div onPointerDown={(e) => e.stopPropagation()}>
                              <FormDatePicker
                                control={form.control}
                                name={`wapList.${index}.waStartDate`}
                                label='Start Date'
                                showDateIcon={true}
                                disabled={index !== 0}
                                minDate={index === 0 ? new Date(startEndDate[0]?.waStartDate ?? "") : form.watch(`wapList.${index - 1}.waEndDate`) ? new Date(form.watch(`wapList.${index - 1}.waEndDate`)!) : new Date()}
                                maxDate={new Date(startEndDate[0]?.waEndDate ?? "")}
                              />
                            </div>
                            <div onPointerDown={(e) => e.stopPropagation()}>
                              <FormDatePicker
                                control={form.control}
                                name={`wapList.${index}.waEndDate`}
                                label="End date"
                                showDateIcon={true}

                                minDate={
                                  form.watch(`wapList.${index}.waStartDate`)
                                    ? (() => {
                                      const date = new Date(form.watch(`wapList.${index}.waStartDate`)!);
                                      date.setDate(date.getDate() + 1);
                                      return date;
                                    })()
                                    : new Date(startEndDate[0]?.waStartDate ?? "")
                                }
                                maxDate={new Date(startEndDate[0]?.waEndDate ?? "")}
                              />
                            </div>

                          </div>
                        </div>
                      </DragItemWrapper>)
                    }
                    )}
                    {fields.length < 1 && <div className={cn("flex flex-col  w-full h-[440px] gap-2 items-center justify-center bg-slate-400 p-2  rounded  dark:hover:bg-slate-900 transition-colors ")}>
                      {isWayDetailLoading ? " Fetching Data" : "Add Water Accounting Periods"}
                    </div>}
                  </div>
                </SortableContext>
              </DndContext>
              {/* </div> */}
              <div className='flex w-full items-center justify-center'>{fields?.length > 0 && <Button onClick={() => form.handleSubmit(onSubmit)} disabled={isWaysCreatePending || !enableSubmit} form="myForm" className="text-sm w-1/4" >{isWaysCreatePending ? wayDetail?.data.length > 0 ? "Updating" : "Creating" : wayDetail?.data.length > 0 ? "Update" : "Create"}</Button>}</div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Time
