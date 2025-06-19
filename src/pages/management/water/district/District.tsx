// import { Button } from "@/components/ui/button";
// import { ArrowLeft, ArrowRight, ChevronDown, Plus, Trash } from "lucide-react";
// import { useEffect, useState } from "react";
// import { DndContext, DragEndEvent } from "@dnd-kit/core"
// import DragItemWrapper from "@/components/DndComponent/DragListWrapper";
// import { SortableContext, arrayMove } from "@dnd-kit/sortable";
// import { cn } from "@/utils/cn";
// import { useForm, useFieldArray } from "react-hook-form";
// import { Form } from '@/components/ui/form';
// import { FormDatePicker } from "@/components/FormComponent/FormDatePicker";
// import { FormInput } from "@/components/FormComponent/FormInput";
// import { FormComboBox } from "@/components/FormComponent/FormRTSelect";
// import dayjs from "dayjs";
// import { useGetWaptOptions, useGetWaysOptions, usePostWays } from "@/services/timeSeries";
// import { convertKeysToSnakeCase } from "@/utils/stringConversion";
// import { toast } from "react-toastify";
// import { showErrorToast } from "@/utils/tools";
// const data = [{ name: "jumir", id: 12 }, { name: "jumir22", id: 21 }, { name: "jumir33", id: 32 }, { name: "jumir44", id: 24 }, { name: "jumir55", id: 54 }, { name: "jumir66", id: 68 }, { name: "jumir gosain", id: 645 }, { name: "jumir88", id: 68676 }, { name: "jumir77", id: 688 }, { name: "jumir99", id: 988 }]

// export const NestedChildArray: React.FC<{ form: any; listIndex: number, parentName: string ,control:any,yearList:any[] }> = ({ form, listIndex, parentName,control,yearList }) => {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: `wapList.${listIndex}.child`,
//   });
//   const startEndDate = yearList?.filter((item:any) => item.value === form.watch("wayYear") )

//   const formatNumber = (num: number) => num.toString().padStart(2, '0');
//   return <div className="flex flex-col gap-2 items-center w-full">
//     {fields?.map((item: any, index) => {
//       return (
//         <div key={index} className="flex flex-col w-full">
//           <div className="flex items-center justify-center w-full gap-3">
//             <FormInput name={`wapList.${listIndex}.child.${index}.periodName`} label="Name" type="text" control={control} placeholder="name" disabled={true} />
//               <div onPointerDown={(e) => e.stopPropagation()}>
//               <FormDatePicker
//                 control={control}
//                 name={`wapList.${listIndex}.child.${index}.startDate`}
//                 label='Start Date'
//                 showDateIcon={true}
//                 disabled={index === 0 ? false : form.watch(`wapList.${listIndex}.child[${index-1}].endDate`) ? false : true }
//                 minDate={index ==0 ? new Date(startEndDate[0]?.waStartDate ?? "") : new Date(form.watch(`wapList.${listIndex}.child[${index-1}].endDate`))}
//                 maxDate={new Date(startEndDate[0]?.waEndDate ?? "")}
//               />
//             </div>
//             <div onPointerDown={(e) => e.stopPropagation()}>
//               <FormDatePicker
//                 control={control}
//                 name={`wapList.${listIndex}.child.${index}.endDate`}
//                 label="End date"
//                 showDateIcon={true}
//                 disabled={form.watch(`wapList.${listIndex}.child.${index}.startDate`) ? false: true}
//                 minDate={new Date(form.watch(`wapList.${listIndex}.child.${index}.startDate`) )}
//                 maxDate={new Date(startEndDate[0]?.waEndDate ?? "")}
//               />
//             </div>

//           </div>
//         </div>

//       )
//     })}
//     <div className="flex  w-full justify-center gap-2">
//       <Button variant={'secondary'} type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { append({ periodName: parentName + " " + formatNumber(fields.length + 1), startDate: undefined, endDate: undefined }) }}> <Plus /></Button>
//       {fields.length > 1 && <Button variant={'destructive'} type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { remove(fields.length - 1) }}> <Trash /></Button>}
//     </div>

//   </div>

// }

// const District = () => {
//   const [listA, setListA] = useState<any>([])
//   // const [listB, setListB] = useState<any>([]);
//   const [selectedA, setSelectedA] = useState<any>([]);
//   const [selectedB, setSelectedB] = useState<any>([]);
//   const [openAccordion, setOpenAccordion] = useState<any>([])
//   const { data:wapTypeOptions,isLoading:isWapTypeOptionsLoading } = useGetWaptOptions()
//   const {data:waysOptions,isLoading:waysOptionsLoading} = useGetWaysOptions();
//   const {mutate} = usePostWays();

//   useEffect(()=>{
//     if(wapTypeOptions && !isWapTypeOptionsLoading){
//      setListA(wapTypeOptions?.data)
// }

// },[wapTypeOptions])

//   const formatNumber = (num: number) => num.toString().padStart(2, '0');

//   type WayFormType = {

//     wayYear: string;
//     wapList: {
//       waptId: number;
//       name: string;
//       child: {
//         periodName: string;
//         startDate: string | undefined;
//         endDate: string | undefined;
//       }[]
//     }[];
//   };

//   const form = useForm<WayFormType>({
//     defaultValues: {
//       wayYear: "",
//       wapList: []
//     },
//   }); 

//   const { fields, move, append, replace } = useFieldArray({
//     control: form.control,
//     name: "wapList"
//   });

//   const handleRightShift = () => {
//     const remainingItemA = listA?.filter((item: any) => !selectedA.includes(item.value))
//     const transferItem = listA?.filter((item: any) => selectedA.includes(item.value))
//     const listForForm = transferItem?.map((item: any) => {
//       return {
//         waptId: item?.value,
//         name: item?.label,
//         child: [{
//           periodName: item?.label + " " + formatNumber(1), startDate: undefined,
//           endDate: undefined
//         }]
//       }
//     })
//     append(listForForm)
//     setListA(remainingItemA);
//     // setListB([...listB, ...transferItem]);
//     setOpenAccordion([...openAccordion, ...selectedA])
//     setSelectedA([]);
//   }
//   const handleLeftShift = () => {
//     const remainingItemsFields = fields?.filter((item: any) => !selectedB.includes(item.waptId))
//     const transferItem = fields?.filter((item: any) => selectedB.includes(item.waptId))
//     const listForType = transferItem?.map((item:any)=> {return {value:item?.waptId, label:item?.name }})
//     setListA([...listA, ...listForType]);
//     form.setValue("wapList", remainingItemsFields)
//     setSelectedB([]);
//   }
//   const handleClick = (selectedList: any, setSelectedList: any, id: string) => {
//     if (!selectedList.includes(id)) {
//       setSelectedList([...selectedList, id])
//     }
//     else {
//       setSelectedList((prev: any) => prev.filter((listId: any) => listId !== id))
//     }
//   }

//   const handleAccordion = (id: any) => {
//     if (openAccordion.includes(id)) {
//       setOpenAccordion(openAccordion?.filter((item: any) => item !== id));
//     }
//     else {
//       setOpenAccordion([...openAccordion, id]);
//     }
//   }

//   // Reorder list function
//   // const reorderList = (e: DragEndEvent) => {
//   //   if (!e.over) return;

//   //   if (e.active.id !== e.over.id) {
//   //     setListB((list: any[]) => {
//   //       const oldIdx = list.findIndex((item) => item.id.toString() === e.active.id.toString());
//   //       const newIdx = list.findIndex((item) => item.id.toString() === e.over!.id.toString());
//   //       return arrayMove(list, oldIdx, newIdx);
//   //     });
//   //   }
//   // };

//   const reorderList = (e: DragEndEvent) => {
//     if (!e.over) return;

//     if (e.active.id !== e.over.id) {
//       const list = form.getValues("wapList");
//       const oldIdx = list.findIndex((item) => item.waptId.toString() === e.active.id.toString());
//       const newIdx = list.findIndex((item) => item.waptId.toString() === e.over!.id.toString());
//       if (oldIdx !== -1 && newIdx !== -1) {
//         move(oldIdx, newIdx); // This reorders the form array
//       }
//     }
//   };


//   const onSubmit = (data: WayFormType) => {
//     const formattedData: any = {
//       ...data,
//       wapList: data.wapList.map(wap => ({
//         ...wap,
//         child: wap.child.map(child => ({
//           waPeriodName:child.periodName,
//           waStartDate: child.startDate ? dayjs(child.startDate).format("YYYY-MM-DD") : undefined,
//           waEndDate: child.endDate ? dayjs(child.endDate).format("YYYY-MM-DD") : undefined,
//         }))
//       }))
//     };

//    mutate(convertKeysToSnakeCase(formattedData),{
//          onSuccess: (data: any) => {
//            // Invalidate and refetch
//           console.log(data)
//            toast.success(data?.message);
       
//            form.reset(); // Reset the form after successful submission
//             setListA(wapTypeOptions)
//          },
//          onError: (error) => {
//                showErrorToast(error?.response?.data.message);
//          },
//        })
//   };



//   return <div className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50 ">
//     <div className="flex w-full  h-[660px] justify-evenly items-center mt-2">
//       <div className="flex flex-col gap-2 w-[45%] h-full border border-black rounded p-2  dark:border-slate-50">
//         <h1 className="h-6">List of Water accounting period types</h1>
//           { isWapTypeOptionsLoading ? <>loading water accounting period type </> :  
//         <div className="flex flex-col gap-2 flex-grow overflow-y-auto ">
          
//       {listA?.length > 0 && listA?.map((item: any) => <div key={item?.value} className="flex w-full gap-2 items-center h-12 bg-slate-400 px-2 rounded">
//             <input className="h-5 w-5" type="checkbox" onClick={() => handleClick(selectedA,setSelectedA,item?.value) } /> <div className="flex flex-grow text-xl">{item?.label}</div>
//           </div>)}
//         </div>}
       
//       </div>
//       <div className="w-[5%] flex flex-col items-center justify-center gap-2"><Button disabled={selectedA?.length === 0 || !form.watch("wayYear") } onClick={handleRightShift}> <ArrowRight /></Button><Button disabled={selectedB?.length === 0} onClick={handleLeftShift}><ArrowLeft /> </Button></div>
//       <div className="flex flex-col gap-2 w-[45%] h-full border border-black rounded p-2  dark:border-slate-50">
//         <Form {...form}>
//           <form id="myForm" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 flex-grow overflow-y-auto ">
//             <div className="h-auto  bg-white p-2  " >
//               <FormComboBox
//                 control={form.control}
//                 name='wayYear'
//                 label='Water Accounting Year'
//                 placeholder='Select Year'
//                 options={waysOptions?.data || []}

//               />
//             </div>
//             {/* <div className="flex flex-col flex-grow overflow-y-auto g-2"> */}
//             <DndContext onDragEnd={reorderList} onDragStart={() => setOpenAccordion(fields.map((item: any) => item.waptId))}>
//               <SortableContext items={fields.map((item: any) => item?.waptId?.toString())}>
//                 {fields.length > 0 && fields?.map((item: any, index) => <DragItemWrapper key={item.waptId} id={item.waptId.toString()}>
//                   <div className={cn("flex flex-col  w-full gap-2 items-center bg-slate-400 p-2 hover:bg-royalBlue rounded", openAccordion.includes(item.waptId) ? "h-auto" : "h-10")}>
//                     <div className="flex w-full gap-2 items-center">
//                       <input className="h-5 w-5" type="checkbox" onPointerDown={(e) => {
//                         e.stopPropagation(); // important to prevent DnD taking over
//                         handleClick(selectedB, setSelectedB, item.waptId);
//                       }} /> <div className="flex flex-grow text-xl">{item.name}</div><div className="hover:bg-slate-200"><ChevronDown className={cn(openAccordion.includes(item.waptId) ? "rotate-180" : "")} onPointerDown={(e) => { e.stopPropagation(); handleAccordion(item?.waptId) }} /></div>
//                     </div>
//                     <div className={cn("flex justify-between items-center w-full g-1", openAccordion.includes(item.waptId) ? "" : "hidden")}>
//                       <NestedChildArray form={form} listIndex={index} parentName={item.name} control={form.control} yearList={waysOptions?.data || []}  />
//                     </div>
//                   </div>
//                 </DragItemWrapper>)}
//               </SortableContext>
//             </DndContext>
//             {/* </div> */}
//           </form>
//         </Form>
//         {fields?.length > 0 && <Button onClick={() => form.handleSubmit(onSubmit)} form="myForm" className="text-xl" >Submit</Button>}
//       </div>

//     </div>


//   </div>;
// };



// export default District;

import React from 'react'

const District = () => {
  return (
    <div>
      t4eetsfa
    </div>
  )
}

export default District
