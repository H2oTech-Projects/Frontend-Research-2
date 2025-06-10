import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import DragItemWrapper from "@/components/DndComponent/DragListWrapper";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { cn } from "@/utils/cn";
import { useForm, useFieldArray } from "react-hook-form";
import { Form } from '@/components/ui/form';
import { FormDatePicker } from "@/components/FormComponent/FormDatePicker";
const data = [{ name: "jumir", id: 12 }, { name: "jumir22", id: 21 }, { name: "jumir33", id: 32 }, { name: "jumir44", id: 24 }, { name: "jumir55", id: 54 }, { name: "jumir66", id: 68 }, { name: "jumir gosain", id: 645 }, { name: "jumir88", id: 68676 }, { name: "jumir77", id: 688 }, { name: "jumir99", id: 988 }]

const District = () => {
  const [listA, setListA] = useState<any>(data)
  // const [listB, setListB] = useState<any>([]);
  const [selectedA, setSelectedA] = useState<any>([]);
  const [selectedB, setSelectedB] = useState<any>([]);
  const [openAccordion, setOpenAccordion] = useState<any>([])
  type ListBFormType = {
    list: {
      itemId: number;
      name: string;
      startDate: string | undefined;
      endDate: string | undefined;
    }[];
  };

  const form = useForm<ListBFormType>({
    defaultValues: { list: [] },
    shouldUnregister: true
  });

  const { fields, move } = useFieldArray({
    control: form.control,
    name: "list"
  });


  const handleRightShift = () => {
    const remainingItemA = listA?.filter((item: any) => !selectedA.includes(item.id))
    const transferItem = listA?.filter((item: any) => selectedA.includes(item.id))
    const listForForm = transferItem?.map((item: any) => {
        return {
          itemId: item?.id,
          name: item?.name,
          startDate: undefined,
          endDate: undefined
        }
      })
    form.setValue("list",[...fields,...listForForm])
    setListA(remainingItemA);
    // setListB([...listB, ...transferItem]);
    setOpenAccordion([...openAccordion,...selectedA])
    setSelectedA([]);
  }
  const handleLeftShift = () => {
    const remainingItemsFields = fields?.filter((item: any) => !selectedB.includes(item.itemId))
    const transferItem = fields?.filter((item: any) => selectedB.includes(item.itemId))
    setListA([...listA, ...transferItem]);
    form.setValue("list",remainingItemsFields)
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
    const list = form.getValues("list");
    const oldIdx = list.findIndex((item) => item.itemId.toString() === e.active.id.toString());
    const newIdx = list.findIndex((item) => item.itemId.toString() === e.over!.id.toString());
    if (oldIdx !== -1 && newIdx !== -1) {
      move(oldIdx, newIdx); // This reorders the form array
    }
  }
};

  const onSubmit = (data:any)=>{
    console.log(data)
}

  return <div className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50 ">
    <div className="flex w-full  h-[560px] justify-evenly items-center mt-2">
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
        <h1 className="h-6">List of B</h1>
          <Form {...form}>
        <form id="myForm" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 flex-grow overflow-y-auto ">
          {/* <div className="flex flex-col flex-grow overflow-y-auto g-2"> */}
      <DndContext  onDragEnd={reorderList} onDragStart={() => setOpenAccordion(fields.map((item: any) => item.itemId))}>
            <SortableContext items={fields.map((item: any) => item.itemId.toString())}>
              {fields.length > 0 && fields?.map((item: any,index) => <DragItemWrapper key={item.id} id={item.itemId.toString()}>
                <div className={cn("flex flex-col  w-full gap-2 items-center bg-slate-400 p-2 hover:bg-royalBlue rounded", openAccordion.includes(item.itemId) ? "h-auto" : "h-10")}>
                  <div className="flex w-full gap-2 items-center">
                    <input className="h-5 w-5" type="checkbox" onPointerDown={(e) => {
                      e.stopPropagation(); // important to prevent DnD taking over
                      handleClick(selectedB, setSelectedB, item.itemId);
                    }} /> <div className="flex flex-grow text-xl">{item.name}</div><div className="hover:bg-slate-200"><ChevronDown className={cn(openAccordion.includes(item.itemId) ? "rotate-180" : "")} onPointerDown={(e) => { e.stopPropagation(); handleAccordion(item?.itemId) }} /></div>
                  </div>
                  {openAccordion.includes(item.itemId) && <div className="flex justify-between items-center w-full   g-1" >
                   <div onPointerDown={(e)=> e.stopPropagation()}>
                 <FormDatePicker
                      control={form.control}
                      name={`list.${index}.startDate`}
                      label='Start Date'
                      showDateIcon={true}
                    />
                  </div>
                  <div onPointerDown={(e)=> e.stopPropagation()}> 
                    <FormDatePicker
                      control={form.control}
                      name={`list.${index}.endDate`}
                      label='End Date'
                      showDateIcon={true}
                    />
                    </div>


                  </div>}
                </div>
              </DragItemWrapper>)}
            </SortableContext>
          </DndContext>
{/* </div> */}
        </form>
        </Form> 
        {fields?.length > 0 && <Button onClick={()=>form.handleSubmit(onSubmit)} form="myForm" className="text-xl" >Submit</Button>}
      </div>

    </div>


  </div>;
};



export default District;
