import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type BasicSelectPropsType = {
  itemList: { label: string; value: string }[];
  label: string;
}
const BasicSelect = ({ itemList, label }: BasicSelectPropsType) => {
  return (
    <div className="flex items-center gap-2 ">
      <label>{label} : </label>
      <Select  onValueChange={(value) => console.log(value)}>
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
