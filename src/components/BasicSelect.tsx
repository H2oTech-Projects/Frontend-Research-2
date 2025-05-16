import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type BasicSelectPropsType = {
  itemList: { label: string; value: string }[];
  label: string;
  Value:string;
  setValue: (value: string) => void;
}
const BasicSelect = ({ itemList, label,Value ,setValue}: BasicSelectPropsType) => {
  return (
    <div className="flex flex-col gap-1  space-y-2 ">
      <label className="font-medium text-sm">{label} </label>
      <Select value={Value }  onValueChange={(value) => setValue(value)}>
        <SelectTrigger className="w-full h-10 border  rounded-md transition-colors" >
          <SelectValue placeholder={`Select a ${label}`} />
        </SelectTrigger>
        <SelectContent className="!z-[800]">
          {itemList.map((item) => (
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
