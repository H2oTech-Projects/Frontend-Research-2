import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface FormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "password" | "email" | "number";
}

export function FormInput({ control, name, label, placeholder,type }: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} type={type}/>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}