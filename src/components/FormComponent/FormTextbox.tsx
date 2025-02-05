import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface FormTextboxProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
}

export function FormTextbox({ control, name, label, placeholder, rows = 4 }: FormTextboxProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} rows={rows} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}