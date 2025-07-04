import BasicSelect from '@/components/BasicSelect'
import DragItemWrapper from '@/components/DndComponent/DragListWrapper'
import { FormDatePicker } from '@/components/FormComponent/FormDatePicker'
import { FormInput } from '@/components/FormComponent/FormInput'
import { FormComboBox } from '@/components/FormComponent/FormRTSelect'
import CustomModal from '@/components/modal/ConfirmModal'
import PageHeader from '@/components/PageHeader'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useDeleteWapt, useGetWaptOptions, useGetWaysDetails, useGetWaysOptions, usePostWapt, usePutRankWapt, usePutWapt, usePutWays, } from '@/services/timeSeries'
import { DELETE_WAPTS, GET_WAPT_OPTIONS, GET_WAYS_DETAILS, POST_WAPTS, PUT_WAPTS, PUT_WAYS, RANK_WAPTS } from '@/services/timeSeries/constants'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { showErrorToast } from '@/utils/tools'
import {
  DndContext, DragEndEvent, PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useQueryClient } from '@tanstack/react-query'
import { useMediaQuery } from '@uidotdev/usehooks'
import dayjs from 'dayjs'
import { ArrowLeft, ArrowRight, Check, Pencil, SquarePlus, Trash, X } from 'lucide-react'
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
  const isDesktopDevice = useMediaQuery("(min-width: 854px)");
  const queryClient = useQueryClient();
  const [wapYear, setWapYear] = useState<null | string>(null);
  const { data: wapTypeOptions, isLoading: isWapTypeOptionsLoading } = useGetWaptOptions(wapYear)
  const { data: waysOptions, isLoading: waysOptionsLoading } = useGetWaysOptions();
  const [listOfWapType, setListOfWapType] = useState<any>([]);
  const [selectedWapType, setSelectedWapType] = useState<string[]>([]);
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number>();
  const [waptEditElement, setWaptEditElement] = useState<any>(null)
  const { mutate: createWays, isPending: isWaysCreatePending } = usePutWays();
  const { mutate: postWapt, isPending: isWaptCreating } = usePostWapt();
  const { mutate: updateWapt, isPending: isWaptUpdating } = usePutWapt()
  const { mutate: deleteWapt, isPending: isWaptDeleting } = useDeleteWapt();
  const { mutate: rankWapt, isPending: isWaptRanking } = usePutRankWapt()
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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
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

  const handleRightShift = () => {
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
    const formattedData = { ...data, wapYearId: wapYear }
    if (!formattedData?.id) {
      postWapt(formattedData, {
        onSuccess: (data: any) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({ queryKey: [GET_WAPT_OPTIONS, wapYear] });
          queryClient.invalidateQueries({ queryKey: [POST_WAPTS] });
          waptForm.reset();
        },
        onError: (error) => {
          showErrorToast(error?.response?.data.message);
          queryClient.invalidateQueries({ queryKey: [POST_WAPTS] });
        },
      })
    } else {
      updateWapt(formattedData, {
        onSuccess: (data: any) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({ queryKey: [GET_WAPT_OPTIONS, wapYear] });
          queryClient.invalidateQueries({ queryKey: [PUT_WAPTS] });
          queryClient.invalidateQueries({ queryKey: [GET_WAYS_DETAILS, wapYear] });
          setWaptEditElement(null);
        },
        onError: (error) => {
          showErrorToast(error?.response?.data.message);
          queryClient.invalidateQueries({ queryKey: [POST_WAPTS] })
        },
      })
    }
  }

  const handleDelete = () => {
    const deleteData = { id: id, wapYear: wapYear }
    deleteWapt(deleteData, {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: [GET_WAPT_OPTIONS, wapYear] })
        queryClient.invalidateQueries({ queryKey: [RANK_WAPTS] });
        toast.success(data?.message);
        setSelectedWapType((prev: any) => prev.filter((listId: any) => listId !== id))
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
  };

  const handleRankWapt = () => {
    const formData = {
      wapYearId: wapYear,
      data: listOfWapType.map((item: any, index: number) => { return { id: item?.id, rank: index + 1 } })
    }
    rankWapt(formData, {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: [GET_WAPT_OPTIONS, wapYear] })
        queryClient.invalidateQueries({ queryKey: [DELETE_WAPTS] });
        toast.success(data?.message);
        setSelectedWapType((prev: any) => prev.filter((listId: any) => listId !== id))
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
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
        <div className={cn("w-full justify-evenly items-center mt-2 gap-4", isDesktopDevice ? "flex   h-[calc(100vh-140px)] " : "flex flex-col h-auto")}>
          <div className={cn("flex flex-col gap-4  h-[calc(100vh-150px)]", isDesktopDevice ? "w-[45%]" : "w-full")}>
            <div className='flex flex-col gap-2 bg-white p-2  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors'>
              <div className='text-lg text-royalBlue dark:text-slate-50 '>Select Water Accounting Year</div>
              <div className="px-2"><BasicSelect setValue={setWapYear} Value={wapYear!} itemList={waysOptions?.data} showLabel={false} /></div>
            </div>
            <Form {...waptForm} >
              <form onSubmit={waptForm.handleSubmit(onWaptSubmit)} className="flex flex-col gap-2 w-full  bg-white p-2  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors ">
                <div className='text-lg text-royalBlue dark:text-slate-50 '>Create Water Accounting Period Types</div>
                <div className='flex w-full gap-2 p-2 '>
                  <div className='flex-grow'>  <FormInput
                    control={waptForm.control}
                    name='waptName'
                    label='Period Name'
                    placeholder='Enter Period Type Name'
                    type='text'
                    showLabel={false}
                  /></div>   <Button disabled={waptForm.watch("waptName") ? false : isWaptCreating ? false : true} type="submit">{"Create"}</Button> </div>

              </form>
            </Form>

            <div className="flex flex-col  w-full flex-grow gap-1  bg-white p-3 pt-1 dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors ">
              <div className='flex justify-between'>   <div className='text-lg text-royalBlue dark:text-slate-50 '>List of Water Accounting Period Types</div>
              </div>
              {isWapTypeOptionsLoading ? <div className='h-full flex justify-center items-center'><Spinner /></div> : <div className='flex flex-col gap-2 overflow-y-auto h-[calc(100vh-472px)]  overflow-x-hidden '>
                {/* {listOfWapType?.length > 0 && listOfWapType?.map((item: any) => {
                  if (item?.id !== waptEditElement?.id) {
                    return (<div key={item?.id} className="flex w-full gap-2 items-center h-auto bg-slate-400 dark:bg-slate-900 p-4 rounded">
                      <input className="h-5 w-5" type="checkbox" checked={selectedWapType.includes(item?.id)} onChange={() => handleClick(selectedWapType, setSelectedWapType, item?.id)} /> <div className="flex flex-grow text-xl">{item?.waPeriodTypeName}</div> <Button onClick={() => setWaptEditElement({ id: item?.id, waptName: item?.waPeriodTypeName })}> <Pencil /></Button> <Button variant={"destructive"} disabled={isWaptDeleting} onClick={() => { setId(item?.id); setOpen(true); }}><Trash /></Button>
                    </div>)
                  } else {
                    return <div key={item?.id} className="flex w-full gap-2 items-center h-auto bg-slate-400 dark:bg-slate-900 p-4 rounded">
                      <input
                        value={waptEditElement?.waptName}
                        onChange={(e) => setWaptEditElement({ id: item?.id, waptName: e.target.value })}
                        className="flex-grow rounded px-2 py-1 text-black dark:text-white bg-white dark:bg-slate-700"
                      />
                      <Button className='bg-green-600' disabled={isWaptUpdating} onClick={() => { onWaptSubmit(waptEditElement) }}> <Check /></Button>
                      <Button variant={'destructive'} onClick={() => setWaptEditElement(null)}> <X /></Button>
                    </div>
                  }

                })} */}
                {listOfWapType?.length < 1 && <div className='h-full flex flex-col gap-4 justify-center items-center text-black  dark:text-slate-50'><div className='opacity-50'>Add Water Accounting Period Types</div> <SquarePlus className='opacity-40' size={60} /></div>}
                <DndContext
                  sensors={sensors}
                  onDragEnd={(e) => {
                    if (!e.over || e.active.id === e.over.id) return;
                    const oldIndex = listOfWapType.findIndex((item: any) => item.id.toString() === e.active.id.toString());
                    const newIndex = listOfWapType.findIndex((item: any) => item.id.toString() === e.over!.id.toString());
                    if (oldIndex === -1 || newIndex === -1) return;
                    const newList = arrayMove(listOfWapType, oldIndex, newIndex);
                    setListOfWapType(newList);
                  }}
                >
                  <SortableContext items={listOfWapType.map((item: any) => item.id.toString())}>
                    {listOfWapType?.map((item: any) => (
                      <DragItemWrapper key={item?.id} id={item?.id.toString()} disable={waptEditElement !== null}>
                        {item?.id !== waptEditElement?.id ? <div key={item?.id} className="flex w-full gap-2 items-center text-white h-auto bg-slate-400 hover:bg-royalBlue dark:bg-slate-900 p-4 rounded" onPointerDown={(e) => {
                          if (e.pointerType === "touch") {
                            e.stopPropagation();
                          }
                        }} >
                          <input
                            onPointerDown={(e) => e.stopPropagation()}
                            className="h-5 w-5"
                            type="checkbox"
                            checked={selectedWapType.includes(item?.id)}
                            onChange={() => handleClick(selectedWapType, setSelectedWapType, item?.id)}
                          />
                          <div className="flex flex-grow text-xl">{item?.waPeriodTypeName}</div>
                          <Button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => setWaptEditElement({ id: item?.id, waptName: item?.waPeriodTypeName })}>
                            <Pencil />
                          </Button>
                          <Button
                            variant={"destructive"}
                            onPointerDown={(e) => e.stopPropagation()}
                            disabled={isWaptDeleting}
                            onClick={() => { setId(item?.id); setOpen(true); }}>
                            <Trash />
                          </Button>
                        </div>
                          : <div key={item?.id} className="flex w-full gap-2 items-center h-auto bg-slate-400 dark:bg-slate-900 p-4 rounded">
                            <input
                              type="text"
                              value={waptEditElement?.waptName}
                              onPointerDown={(e) => e.stopPropagation()}
                              onChange={(e) => setWaptEditElement({ id: item?.id, waptName: e.target.value })}
                              className="flex-grow rounded px-2 py-1 text-black dark:text-white bg-white dark:bg-slate-700"
                            />
                            <Button
                              onPointerDown={(e) => e.stopPropagation()}
                              className='bg-green-600' disabled={isWaptUpdating}
                              onClick={() => { onWaptSubmit(waptEditElement) }}>
                              <Check />
                            </Button>
                            <Button
                              onPointerDown={(e) => e.stopPropagation()}
                              variant={'destructive'}
                              onClick={() => setWaptEditElement(null)}>
                              <X />
                            </Button>
                          </div>}
                      </DragItemWrapper>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>}

              {<div className="flex items-center justify-center gap-2">
                {listOfWapType?.length > 1 && <Button disabled={JSON.stringify(listOfWapType) === JSON.stringify(wapTypeOptions?.data)} onClick={() => handleRankWapt()}>Sort</Button>}
                {selectedWapType.length > 0 && <Button disabled={selectedWapType.length < 1} onClick={handleRightShift} >Add to Wap<ArrowRight /> </Button>} </div>}
            </div>
          </div>

          <Form {...form}>
            <form id="myForm" onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-2 flex-grow h-[calc(100vh-150px)]  bg-white p-3  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors", isDesktopDevice ? " w-[45%]" : "w-full")}>
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
              <DndContext sensors={sensors} onDragEnd={reorderList}  >
                <SortableContext items={fields.map((item: any, index) => item?.id?.toString())}>
                  <div className='flex flex-col flex-grow gap-2 overflow-y-auto overflow-x-hidden py-2'>

                    {fields.length > 0 && fields?.map((item: any, index) => {
                      return (<DragItemWrapper key={item?.id} id={item?.id?.toString()}>
                        <div className={cn("flex flex-col  w-full gap-2 items-center text-slate-50 bg-royalBlue p-2 hover:bg-slate-400 rounded h-auto dark:bg-slate-900 dark:hover:bg-slate-400 transition-colors ")} onPointerDown={(e) => {
                          if (e.pointerType === "touch") {
                            e.stopPropagation();
                          }
                        }}>
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
                                disabled
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
                                disabled={index + 1 === fields.length ? true : false}
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
                    {fields.length < 1 && <div className={cn("flex flex-col  w-full h-[calc(100vh-164px)] gap-2 items-center justify-center  p-2  rounded  transition-colors ")}>
                      {isWayDetailLoading ? <Spinner /> : <div className='w-full h-full flex flex-col justify-center items-center'>
                        <div className='opacity-50'>Add Water Accounting Period</div>
                        <SquarePlus className='opacity-40' size={60} />
                      </div>}
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
