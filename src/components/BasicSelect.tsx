import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type BasicSelectPropsType = {
  itemList: { label: string; value: string }[];
  label: string;
  Value:string;
  setValue: (value: string) => void;
}
const BasicSelect = ({ itemList, label,Value ,setValue}: BasicSelectPropsType) => {
  return (
    <div className="flex items-center gap-2 ">
      <label className="w-[6rem]">{label} : </label>
      <Select value={Value }  onValueChange={(value) => setValue(value)}>
        <SelectTrigger className="w-64 h-8 transition-colors" >
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
