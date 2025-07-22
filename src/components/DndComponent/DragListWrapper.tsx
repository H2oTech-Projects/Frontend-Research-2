import { useSortable } from "@dnd-kit/sortable";
import { FC, ReactElement } from "react";
import { CSS } from "@dnd-kit/utilities";

interface DragItemWrapperProps {
  id:string,
  children: any,
  disable?:boolean
} 

const DragItemWrapper = (props:DragItemWrapperProps) => { 
  const { attributes, listeners, setNodeRef, transform, transition } = 
    useSortable({ id: props.id, disabled:props.disable ?? false  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
     
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition
      }}
    >
      {props.children}
    </div>
  );
};

export default DragItemWrapper;
