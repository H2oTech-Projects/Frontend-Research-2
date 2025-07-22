import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type BasicSelectPropsType = {
  itemList: { label: string; value: string }[];
  label?: string;
  Value:string;
  showLabel?:boolean
  setValue: (value: string) => void;
  showLabel?: boolean;
}

const BasicSelect = ({ itemList, label,Value ,setValue,showLabel=true}: BasicSelectPropsType) => {
  return (
    <div className="flex flex-col gap-1  space-y-2 ">
      {showLabel &&  <label className="font-medium text-sm">{label} </label> }
      <Select value={Value }  onValueChange={(value) => setValue(value)}>
        <SelectTrigger className="w-full h-10 border  rounded-md transition-colors" >
          <SelectValue placeholder={`Select a ${label}`} />
        </SelectTrigger>
        <SelectContent className="!z-[800]">
          {itemList?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default BasicSelect


export const GeneralSelect = ({ itemList, label, Value ,setValue}: BasicSelectPropsType) => {
  return (
    <div className="flex flex-col gap-1  space-y-2 w-[200px] h-[28px] text-center">
      <select className="h-full rounded-[.5vw] text-slate-900" value={Value} onChange={(e) => setValue(e.target.value)}>
        {itemList.map((item:any) => (
          <option key={item.value} value={item.value} className="text-center">
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}



