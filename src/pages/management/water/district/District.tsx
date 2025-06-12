import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import DragItemWrapper from "@/components/DndComponent/DragListWrapper";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { cn } from "@/utils/cn";
import { useForm, useFieldArray } from "react-hook-form";
import { Form } from '@/components/ui/form';
import { FormDatePicker } from "@/components/FormComponent/FormDatePicker";
import { FormInput } from "@/components/FormComponent/FormInput";
import { FormComboBox } from "@/components/FormComponent/FormRTSelect";
import dayjs from "dayjs";
const data = [{ name: "jumir", id: 12 }, { name: "jumir22", id: 21 }, { name: "jumir33", id: 32 }, { name: "jumir44", id: 24 }, { name: "jumir55", id: 54 }, { name: "jumir66", id: 68 }, { name: "jumir gosain", id: 645 }, { name: "jumir88", id: 68676 }, { name: "jumir77", id: 688 }, { name: "jumir99", id: 988 }]

export const NestedChildArray: React.FC<{ form: any; listIndex: number, parentName: string ,control:any }> = ({ form, listIndex, parentName,control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `wapList.${listIndex}.child`,
  });
  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  return <div className="flex flex-col gap-2 items-center w-full">
    {fields?.map((item: any, index) => {
      return (
        <div key={index} className="flex flex-col w-full">
          <div className="flex items-center justify-center w-full gap-3">
            <FormInput name={`wapList.${listIndex}.child.${index}.name`} label="Name" type="text" control={control} placeholder="name" disabled={true} />
              <div onPointerDown={(e) => e.stopPropagation()}>
              <FormDatePicker
                control={control}
                name={`wapList.${listIndex}.child.${index}.startDate`}
                label='Start Date'
                showDateIcon={true}
                disabled={index === 0 ? false : form.watch(`wapList.${listIndex}.child[${index-1}].endDate`) ? false : true }
                minDate={index ==0 ? new Date("2026-01-01") : new Date(form.watch(`wapList.${listIndex}.child[${index-1}].endDate`))}
                maxDate={new Date("2026-12-31")}
              />
            </div>
            <div onPointerDown={(e) => e.stopPropagation()}>
              <FormDatePicker
                control={control}
                name={`wapList.${listIndex}.child.${index}.endDate`}
                label="End date"
                showDateIcon={true}
                disabled={form.watch(`wapList.${listIndex}.child.${index}.startDate`) ? false: true}
                minDate={new Date(form.watch(`wapList.${listIndex}.child.${index}.startDate`) )}
                maxDate={new Date("2026-12-31")}
              />
            </div>

          </div>
        </div>

      )
    })}
    <div className="flex  w-full justify-center gap-2">
      <Button variant={'secondary'} type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { append({ name: parentName + " " + formatNumber(fields.length + 1), startDate: undefined, endDate: undefined }) }}> <Plus /></Button>
      {fields.length > 1 && <Button variant={'destructive'} type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { remove(fields.length - 1) }}> <Trash /></Button>}
    </div>

  </div>

}

const District = () => {
  const [listA, setListA] = useState<any>(data)
  // const [listB, setListB] = useState<any>([]);
  const [selectedA, setSelectedA] = useState<any>([]);
  const [selectedB, setSelectedB] = useState<any>([]);
  const [openAccordion, setOpenAccordion] = useState<any>([])
  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  const yearList = [
    {
      value: "2028",
      label: "2028"
    },
    {
      value: "2027",
      label: "2027"
    },
    {
      value: "2026",
      label: "2026"
    },
    {
      value: "2025",
      label: "2025"
    },
    {
      value: "2024",
      label: "2024"
    },
    {
      value: "2023",
      label: "2023"
    },
    {
      value: "2022",
      label: "2022"
    },
    {
      value: "2021",
      label: "2021"
    },
    {
      value: "2020",
      label: "2020"
    }
  ]
  type WayFormType = {

    wayYear: string;
    wapList: {
      wapId: number;
      name: string;
      child: {
        name: string;
        startDate: string | undefined;
        endDate: string | undefined;
      }[]
    }[];
  };

  const form = useForm<WayFormType>({
    defaultValues: {
      wayYear: "",
      wapList: []
    },
  });

  const { fields, move, append, replace } = useFieldArray({
    control: form.control,
    name: "wapList"
  });

  const handleRightShift = () => {
    const remainingItemA = listA?.filter((item: any) => !selectedA.includes(item.id))
    const transferItem = listA?.filter((item: any) => selectedA.includes(item.id))
    const listForForm = transferItem?.map((item: any) => {
      return {
        wapId: item?.id,
        name: item?.name,
        child: [{
          name: item.name + " " + formatNumber(1), startDate: undefined,
          endDate: undefined
        }]
      }
    })
    append(listForForm)
    setListA(remainingItemA);
    // setListB([...listB, ...transferItem]);
    setOpenAccordion([...openAccordion, ...selectedA])
    setSelectedA([]);
  }
  const handleLeftShift = () => {
    const remainingItemsFields = fields?.filter((item: any) => !selectedB.includes(item.wapId))
    const transferItem = fields?.filter((item: any) => selectedB.includes(item.wapId))
    setListA([...listA, ...transferItem]);
    form.setValue("wapList", remainingItemsFields)
    setSelectedB([]);
  }
  const handleClick = (selectedList: any, setSelectedList: any, id: string) => {
    if (!selectedList.includes(id)) {
      setSelectedList([...selectedList, id])
    }
    else {
      setSelectedList((prev: any) => prev.filter((listId: any) => listId !== id))
    }
  }

  const handleAccordion = (id: any) => {
    if (openAccordion.includes(id)) {
      setOpenAccordion(openAccordion?.filter((item: any) => item !== id));
    }
    else {
      setOpenAccordion([...openAccordion, id]);
    }
  }

  // Reorder list function
  // const reorderList = (e: DragEndEvent) => {
  //   if (!e.over) return;

  //   if (e.active.id !== e.over.id) {
  //     setListB((list: any[]) => {
  //       const oldIdx = list.findIndex((item) => item.id.toString() === e.active.id.toString());
  //       const newIdx = list.findIndex((item) => item.id.toString() === e.over!.id.toString());
  //       return arrayMove(list, oldIdx, newIdx);
  //     });
  //   }
  // };

  const reorderList = (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      const list = form.getValues("wapList");
      const oldIdx = list.findIndex((item) => item.wapId.toString() === e.active.id.toString());
      const newIdx = list.findIndex((item) => item.wapId.toString() === e.over!.id.toString());
      if (oldIdx !== -1 && newIdx !== -1) {
        move(oldIdx, newIdx); // This reorders the form array
      }
    }
  };


  const onSubmit = (data: WayFormType) => {
  console.log(data,"here")
    const formattedData: WayFormType = {
      ...data,
      wapList: data.wapList.map(wap => ({
        ...wap,
        child: wap.child.map(child => ({
          ...child,
          startDate: child.startDate ? dayjs(child.startDate).format("YYYY-MM-DD") : undefined,
          endDate: child.endDate ? dayjs(child.endDate).format("YYYY-MM-DD") : undefined,
        }))
      }))
    };

    console.log(formattedData);
  };



  return <div className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50 ">
    <div className="flex w-full  h-[660px] justify-evenly items-center mt-2">
      <div className="flex flex-col gap-2 w-[45%] h-full border border-black rounded p-2  dark:border-slate-50">
        <h1 className="h-6">List of A</h1>
        <div className="flex flex-col gap-2 flex-grow overflow-y-auto ">
          {listA.length > 0 && listA?.map((item: any) => <div key={item?.id} className="flex w-full gap-2 items-center h-12 bg-slate-400 px-2 rounded">
            <input className="h-5 w-5" type="checkbox" onClick={() => !selectedA.includes(item?.id) ? setSelectedA([...selectedA, item?.id]) : setSelectedA((prev: any) => prev.filter((id: any) => id !== item?.id))} /> <div className="flex flex-grow text-xl">{item.name}</div>
          </div>)}
        </div>
      </div>
      <div className="w-[5%] flex flex-col items-center justify-center gap-2"><Button disabled={selectedA?.length === 0} onClick={handleRightShift}> <ArrowRight /></Button><Button disabled={selectedB?.length === 0} onClick={handleLeftShift}><ArrowLeft /> </Button></div>
      <div className="flex flex-col gap-2 w-[45%] h-full border border-black rounded p-2  dark:border-slate-50">
        <Form {...form}>
          <form id="myForm" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 flex-grow overflow-y-auto ">
            <div className="h-auto  bg-white p-2  " >
              <FormComboBox
                control={form.control}
                name='wayYear'
                label='Water Accounting Year'
                placeholder='Select Year'
                options={yearList || []}

              />
            </div>
            {/* <div className="flex flex-col flex-grow overflow-y-auto g-2"> */}
            <DndContext onDragEnd={reorderList} onDragStart={() => setOpenAccordion(fields.map((item: any) => item.wapId))}>
              <SortableContext items={fields.map((item: any) => item?.wapId?.toString())}>
                {fields.length > 0 && fields?.map((item: any, index) => <DragItemWrapper key={item.wapId} id={item.wapId.toString()}>
                  <div className={cn("flex flex-col  w-full gap-2 items-center bg-slate-400 p-2 hover:bg-royalBlue rounded", openAccordion.includes(item.wapId) ? "h-auto" : "h-10")}>
                    <div className="flex w-full gap-2 items-center">
                      <input className="h-5 w-5" type="checkbox" onPointerDown={(e) => {
                        e.stopPropagation(); // important to prevent DnD taking over
                        handleClick(selectedB, setSelectedB, item.wapId);
                      }} /> <div className="flex flex-grow text-xl">{item.name}</div><div className="hover:bg-slate-200"><ChevronDown className={cn(openAccordion.includes(item.wapId) ? "rotate-180" : "")} onPointerDown={(e) => { e.stopPropagation(); handleAccordion(item?.wapId) }} /></div>
                    </div>
                    <div className={cn("flex justify-between items-center w-full g-1", openAccordion.includes(item.wapId) ? "" : "hidden")}>
                      <NestedChildArray form={form} listIndex={index} parentName={item.name} control={form.control} />
                    </div>
                  </div>
                </DragItemWrapper>)}
              </SortableContext>
            </DndContext>
            {/* </div> */}
          </form>
        </Form>
        {fields?.length > 0 && <Button onClick={() => form.handleSubmit(onSubmit)} form="myForm" className="text-xl" >Submit</Button>}
      </div>

    </div>


  </div>;
};



export default District;
