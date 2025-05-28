import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface FormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  showLabel?: boolean;
  type: "text" | "password" | "email" | "number";
  disabled?: boolean;
}

export function FormInput({ control, name, label, placeholder, type, showLabel = true,disabled=false }: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {showLabel && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              type={type}
              autoComplete="off"
              disabled={disabled}
              className={type === "number" ? " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}