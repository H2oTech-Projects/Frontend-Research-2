import DragItemWrapper from '@/components/DndComponent/DragListWrapper'
import { FormDatePicker } from '@/components/FormComponent/FormDatePicker'
import { FormComboBox } from '@/components/FormComponent/FormRTSelect'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useGetWaptOptions, useGetWaysDetails, useGetWaysOptions, usePutWays, } from '@/services/timeSeries'
import { GET_WAYS_DETAILS, PUT_WAYS } from '@/services/timeSeries/constants'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { showErrorToast } from '@/utils/tools'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowLeft, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type WayFormType = {
  wayYear: string | undefined;
  wapList: {
    waptId: number;
    waPeriodName: string;
    waStartDate: Date | undefined;
    waEndDate: Date | undefined;
    pId?: number | null
  }[];
};
const Time = () => {
  const queryClient = useQueryClient();
  const { data: wapTypeOptions, isLoading: isWapTypeOptionsLoading } = useGetWaptOptions()
  const { data: waysOptions, isLoading: waysOptionsLoading } = useGetWaysOptions();
  const [listOfWapType, setListOfWapType] = useState<any>([]);
  const [selectedWapType, setSelectedWapType] = useState<string[]>([]);
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const { mutate: createWays, isPending: isWaysCreatePending } = usePutWays();
  const form = useForm<WayFormType>({
    defaultValues: {
      wayYear: undefined,
      wapList: []
    },
  });
  const { data: wayDetail, isLoading: isWayDetailLoading } = useGetWaysDetails(form.getValues("wayYear"))
  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  // const countWapType = (data: any[], waptId: string) => data?.filter(item => item?.waptId.toString() === waptId).length
  const startEndDate = waysOptions?.data?.filter((item: any) => item.value === form.watch("wayYear"))

  useEffect(() => {
    if (wapTypeOptions && !isWapTypeOptionsLoading) {
      setListOfWapType(wapTypeOptions?.data)
    }
  }, [wapTypeOptions])

  useEffect(() => {
    if (waysOptions && !waysOptionsLoading) {
      waysOptions?.data && form.setValue("wayYear", waysOptions?.data[0]?.value)
    }

  }, [waysOptions])


  const { fields, move, append, replace, remove } = useFieldArray({
    control: form.control,
    name: "wapList"
  });

  const handleLeftShift = () => {
    const transferItem = listOfWapType?.filter((item: any) => selectedWapType.includes(item.value));
    const list = form.watch("wapList");
    const listForForm = transferItem?.map((item: any, index: any) => {
      const wap = item?.label;
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
          waptId: item?.value,
          waPeriodName: periodName,
          waStartDate: startDate,
          waEndDate: undefined,
        };
      } else {
        return {
          waptId: item?.value,
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
      const label = listOfWapType.find((t: any) => t.value === item.waptId)?.label ?? "";
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
      const label = listOfWapType.find((t: any) => t.value === item.waptId)?.label ?? "";
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

  const handleWapElementDelete = (deleteIndex: number) => {
    const initialWapList = form.getValues("wapList")
    const remainingWapList = fields.filter((item, index) => index !== deleteIndex)
    const updatedList = remainingWapList?.map((item, index) => {
      return {
        pId: item?.pId || null,
        waptId: item?.waptId,
        waPeriodName: item?.waPeriodName,
        waStartDate: initialWapList[index]?.waStartDate,
        waEndDate: initialWapList[index]?.waEndDate,
      }
    })
    replace(updatedList);
    setEnableSubmit(true);
  }

  useEffect(() => {
    remove();
  }, [form.watch("wayYear")])

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
      wayYear: data?.wayYear,
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
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: [GET_WAYS_DETAILS] })
        queryClient.invalidateQueries({ queryKey: [GET_WAYS_DETAILS, form.getValues('wayYear')] })
        queryClient.invalidateQueries({ queryKey: [GET_WAYS_DETAILS, waysOptions?.data && waysOptions?.data[0]?.value] })
        queryClient.invalidateQueries({ queryKey: [PUT_WAYS] })
        // form.reset(); // Reset the form after successful submission
        // form.setValue("wayYear", waysOptions?.data[0]?.value)
        setEnableSubmit(false);

      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
        queryClient.invalidateQueries({ queryKey: [PUT_WAYS] })
      },
    })
  }


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



  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">
      <PageHeader
        pageHeaderTitle="Time "
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
      />
      <div className="pageContain flex flex-grow flex-col gap-3  ">
        <div className="flex w-full  h-[calc(100vh-140px)] justify-evenly items-center mt-2 gap-2">
          <Form {...form}>
            <form id="myForm" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 flex-grow h-[calc(100vh-150px)] bg-white p-3  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors  ">
              <div className='text-xl text-royalBlue dark:text-white transition-colors'>Create or Update Water Accounting Periods</div>
              <div className="h-auto pb-2 px-2 w-1/2" >
                <FormComboBox
                  control={form.control}
                  name='wayYear'
                  label='Water Accounting Year'
                  placeholder='Select Year'
                  options={waysOptions?.data || []}

                />
              </div>
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
                      {isWayDetailLoading ? " Fetching Data" :  "Add Water Accounting Periods"}   
                    </div>}
                  </div>
                </SortableContext>
              </DndContext>
              {/* </div> */}
              <div className='flex w-full items-center justify-center'>{fields?.length > 0 && <Button onClick={() => form.handleSubmit(onSubmit)} disabled={isWaysCreatePending || !enableSubmit} form="myForm" className="text-sm w-1/4" >{isWaysCreatePending ? wayDetail?.data.length > 0 ? "Updating" : "Creating" : wayDetail?.data.length > 0 ? "Update" : "Create"}</Button>}</div>
            </form>
          </Form>


          <div className="w-[5%] flex flex-col items-center justify-center gap-2"><Button onClick={handleLeftShift} ><ArrowLeft /> </Button></div>
          <div className="flex flex-col gap-2 w-[45%] h-[80%] border border-black rounded p-2  dark:border-slate-50">
            <div className='text-lg text-royalBlue '>List of Water Accounting Period Types</div>
            {isWapTypeOptionsLoading ? <>loading</> : <div className='flex flex-col gap-2'>
              {listOfWapType?.length > 0 && listOfWapType?.map((item: any) => <div key={item?.value} className="flex w-full gap-2 items-center h-12 bg-slate-400 px-2 rounded">
                <input className="h-5 w-5" type="checkbox" checked={selectedWapType.includes(item?.value)} onClick={() => handleClick(selectedWapType, setSelectedWapType, item?.value)} /> <div className="flex flex-grow text-xl">{item?.label}</div>
              </div>)}
            </div>}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Time
